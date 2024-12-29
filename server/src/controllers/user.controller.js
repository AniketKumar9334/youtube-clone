import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Playlist } from "../models/playlist.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { rm } from "fs";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendToken } from "../utils/sendToken.js";
import axios from "axios";


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        res.status(500).json({
            message:
                "Something went wrong while generating referesh and access token",
        });
    }
};

const registerUser = asyncHandler(async (req, res, next) => {
    const { fullName, email, username, password, about } = req.body;
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files.coverImage[0].path
    let coverImage;

    //console.log("email: ", email);

    if (!avatarLocalPath) {
        return next(new ApiError(400, "Avatar file is required"));
    }
    if (
        [fullName, email, username, password, about].some(
            (field) => field?.trim() === ""
        )
    ) {
        rm(avatarLocalPath, () => {
            rm(coverImageLocalPath, () => {});
        });
        return next(new ApiError(400, "All fields are required"));
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        rm(avatarLocalPath, () => {
            rm(coverImageLocalPath, () => {});
        });
        return next(
            new ApiError(409, "User with email or username already exists")
        );
    }

    if (!avatarLocalPath) {
        return next(new ApiError(400, "Avatar file is required"));
    }

    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }

    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);

    // console.log(avatarUrl)
    // return
    const user = await User.create({
        fullName,
        avatar: {
            public_id: avatarUrl.public_id,
            url: avatarUrl.url,
        },
        coverImage: {
            public_id: coverImage.public_id || null,
            url: coverImage.url || null,
        },
        email,
        password,
        about,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        return next(
            new ApiError(500, "Something went wrong while registering the user")
        );
    }

   sendToken(user, 201, res, "User Created sucessfully");
});

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
        return next(new ApiError(400, "username or email is required"));
    }

    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //   return next( new ApiError(400, "username or email is required"))

    // }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        return next(new ApiError(404, "User does not exist"));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return next(new ApiError(401, "Invalid user credentials"));
    }

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    sendToken(loggedInUser, 200, res, "User logged in sucessfully");

    
});

const logoutUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, // this removes the field from document
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        expires: new Date(Date.now()),
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        return next(new ApiError(400, "Invalid old password"));
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res, next) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        return next(new ApiError(400, "All fields are required"));
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email,
            },
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Account details updated successfully")
        );
});

const updateUserAvatar = asyncHandler(async (req, res, next) => {
    const avatarLocalPath = req.file?.path;
    const user = await User.findById(req.user._id);

    if (!avatarLocalPath) {
        return next(new ApiError(400, "Avatar file is missing"));
    }

    //TODO: delete old image - assignment
    await deleteOnCloudinary(user.avatar.public_id);

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: {
                    public_id: avatar.public_id,
                    url: avatar.url,
                },
            },
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedUser,
                "Avatar image updated successfully"
            )
        );
});

const updateUserCoverImage = asyncHandler(async (req, res, next) => {
    const coverImageLocalPath = req.file?.path;

    const user = await User.findById(req.user._id);

    if (!coverImageLocalPath) {
        return next(new ApiError(400, "Avatar file is missing"));
    }

    //TODO: delete old image - assignment
    await deleteOnCloudinary(user.coverImage.public_id);

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    //TODO: delete old image - assignment

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: {
                    public_id: coverImage.public_id,
                    url: coverImage.url,
                },
            },
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedUser,
                "Cover image updated successfully"
            )
        );
});

const getUserChannelProfile = asyncHandler(async (req, res, next) => {
    const { username } = req.params;

    if (!username?.trim()) {
        return next(new ApiError(400, "username is missing"));
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase(),
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo",
            },
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers",
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo",
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
            },
        },
    ]);

    if (!channel?.length) {
        return next(new ApiError(404, "channel does not exists"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channel[0],
                "User channel fetched successfully"
            )
        );
});

const getWatchHistory = asyncHandler(async (req, res, next) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner",
                            },
                        },
                    },
                ],
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "Watch history fetched successfully"
            )
        );
});
const deleteUser = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const userVideos = await Video.find({ owner: userId });
    const user = await User.findById(userId);

    userVideos.forEach(async (video) => {
        // rm(video.videoFile, () => {
        //     rm(video.thumbnail, () => {
        //         console.log("old image deleted");
        //     });
        // });
        const response = await axios.post(`${process.env.VIDEO_SRRVER_URL}/video`, {videoFile: video.videoFile} , {
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log(response.data.message); 
        await deleteOnCloudinary(video.thumbnail.public_id);
        await Video.findByIdAndDelete(video._id);
        await Comment.deleteMany({ video: video._id });
        await Like.deleteMany({ video: video._id });
    });
    await Promise.all([
        Subscription.deleteMany({ subscriber: userId }),
        Subscription.deleteMany({ channel: userId }),
        Tweet.deleteMany({ owner: userId }),
        Comment.deleteMany({ owner: userId }),
        Like.deleteMany({ owner: userId }),
        Playlist.deleteMany({ owner: userId }),
    ]);
    await deleteOnCloudinary(user.avatar.public_id);
    await deleteOnCloudinary(user.coverImage.public_id);
    await User.findByIdAndDelete(req.user?._id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User deleted successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    // refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    deleteUser,
    generateAccessAndRefereshTokens,
};
