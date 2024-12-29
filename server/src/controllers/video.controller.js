import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Playlist } from "../models/playlist.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getVideoDuration } from "../utils/getVideoDuration.js";
import fs, {rm } from "fs";
import { Like } from "../models/like.model.js";
import { v4 as uuidv4 } from "uuid";
import { deleteOnCloudinary, uploadOnCloudinary, uploadVideoToS3 } from "../utils/cloudinary.js";
import axios from "axios";



const getAllVideos = asyncHandler(async (req, res, next) => {
    let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    //TODO: get all videos based on query, sort, pagination

    const keyword = query
        ? {
              title: {
                  $regex: query,
                  $options: "i",
              },
          }
        : {};
    const skip = limit * (page - 1);
    const videos = await Video.aggregate([
        {
            $match: {
                $or: [
                    { owner: new mongoose.Types.ObjectId(userId) },
                    { ...keyword },
                ],
            },
        },
        {
            $sort: {
                updatedAt: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: Number(limit),
        },
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
                            email: 1,
                        },
                    },
                ],
            },
        },
    ]);

    let newVideos = videos;
    newVideos.map((video) => {
        video.owner = video.owner[0];
    });

    res.status(200).json(
        new ApiResponse(200, newVideos, "Video featched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res, next) => {
    const { title, description } = req.body;
    const videoLocalPath = req.files?.videoFile[0]?.path;

    const thumbnailLocalPath = req.files.thumbnail[0].path;
    // TODO: get video, upload to own server, create video

    if (!videoLocalPath || !thumbnailLocalPath) {
        return next(new ApiError(400, "Video and thumbnail are required..."));
    }

    if (!title || !description) {
        rm(videoLocalPath, () => {
            rm(thumbnailLocalPath, () => {
                console.log("remove");
            });
        });
        return next(new ApiError(400, "All filds are required..."));
    }
    const videoDuration = await getVideoDuration(videoLocalPath);

    const lessionId = uuidv4();
    const videoKey = lessionId;
    const videoUrl = videoKey;

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    // Upload video to S3
    await uploadVideoToS3(videoLocalPath, process.env.AWS_S3_BUCKET, `${videoKey}.mp4`);


    const newVideo = await Video.create({
        videoFile: videoUrl,
        thumbnail: {
            public_id: thumbnail.public_id,
            url: thumbnail.url,
        },
        title,
        description,
        duration: videoDuration,
        owner: req.user._id,
    });
  
    fs.unlinkSync(videoLocalPath);

    res.status(201).json(
        new ApiResponse(201, newVideo, "Video created successfully")
    );
});

const getVideoById = asyncHandler(async (req, res, next) => {
    const { videoId } = req.params;
    //TODO: get video by id

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId),
            },
        },
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
                            email: 1,
                        },
                    },
                ],
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
                videoOwner: "$owner",
            },
        },
        {
            $project: {
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                videoOwner: 1,
                videoFile: 1,
                email: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);
    if (!video) {
        return next(new ApiError(404, "Video not found"));
    }

    let newVideo = video[0];
    newVideo.videoOwner = video[0].videoOwner[0];

    res.status(200).json(
        new ApiResponse(200, newVideo, "Video fetched successfully")
    );
});

const getVideoDetailsIChunks = asyncHandler(async (req, res, next) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        return next(new ApiError(404, "Video not found"));
    }
    const videoOwner = await User.findById(video.owner)
    const user = await User.findById(req.user._id);

    user.watchHistory.unshift(video._id);
    if (!video.views.includes(req.user._id)) {
        video.views.unshift(user._id);
    }

    await user.save();
    await video.save();

    res.status(200).json({
        message: "Video details fetched successfully",
        video: video,
    });
});

const updateVideo = asyncHandler(async (req, res, next) => {
    const { videoId } = req.params;
    //TODO: update video details like title, description, thumbnail
    const video = await Video.findById(videoId);
    const thumbnail = req.file?.path;
    const { title, description } = req.body;

    if (video.owner.toString() !== req.user._id.toString()) {
        return next(
            new ApiError(401, "You are not authorized to delete this video")
        );
    }
    if (!video) {
        return next(new ApiError(404, "Video not found"));
    }
    if (!title || !description) {
        return next(new ApiError(400, "All filds are required..."));
    }

    let thumbnailCloudinary
    if (thumbnail) {
        await deleteOnCloudinary(video.thumbnail.public_id);
        thumbnailCloudinary = await uploadOnCloudinary(thumbnail);
    }


    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            title,
            description,
            thumbnail: {
                public_id: thumbnailCloudinary.public_id || video.thumbnail.public_id,
                url: thumbnailCloudinary.url || video.thumbnail.url,
            },
        },
        { new: true, runValidators: false }
    );
    // updateVideo.thumbnail = thumbnail;
    await updatedVideo.save();
    res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res, next) => {
    const { videoId } = req.params;
    //TODO: delete video
    const video = await Video.findById(videoId);
    if (!video) {
        return next(new ApiError(404, "Video not found"));
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        return next(
            new ApiError(401, "You are not authorized to delete this video")
        );
    }

    const likesVideo = await Like.find({ video: videoId });
    likesVideo.forEach(async (like) => {
        await like.remove();
    });
    const commentVideo = await Comment.find({ video: videoId });
    commentVideo.forEach(async (comment) => {
        await comment.remove();
    });

    const playlists = await Playlist.find({ owner: req.user._id });
    playlists.map(async (playlist) => {
        const isVideo = await playlist.videsos.includes(videoId);
        if (isVideo) {
            await playlist.videsos.pull(videoId);
            await playlist.save();
        }
    });

    video.videoSaveWithOtherUser.forEach(async (element) => {
        const user = await User.findById(element);
        user.watchHistory.pull(videoId);
        await user.save();
    });

    await deleteOnCloudinary(video.thumbnail.public_id);
    const response = await axios.post(`${process.env.VIDEO_SRRVER_URL}/video`, {videoFile: video.videoFile} , {
        headers: {
            "Content-Type": "application/json",
        }
    });
    console.log(response.data.message);

    await Video.findByIdAndDelete(videoId);
    res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    );
});

const togglePublishStatus = asyncHandler(async (req, res, next) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        return next(new ApiError(404, "Video not found"));
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        return next(
            new ApiError(401, "You are not authorized to delete this video")
        );
    }
    video.isPublished = !video.isPublished;
    await video.save();
    res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getVideoDetailsIChunks,
};
