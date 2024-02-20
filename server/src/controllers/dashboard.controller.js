import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like - total video views, total subscribers, total videos, total likes etc.

    const userId = req.user._id;
    const channelStats = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos",
                pipeline:[
                    {
                        $lookup:{
                            from: "likes",
                            localField: "_id",
                            foreignField: "video",
                            as: "videolikes"
                        }
                    },
                ]
               
            }
        },
        {
            $lookup:{
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup:{
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        
        {
            $addFields:{
                videosCount: {
                    $size: { $ifNull: ["$videos",[] ]},
                },
                subscribersCount: {
                    $size: { $ifNull: ["$subscribers",[] ]},
                },
                subscriberToCount: {
                    $size: { $ifNull: ["$subscribedTo",[] ]},
                },
                likesCount: {
                    $size: { $ifNull: ["$videos.videolikes",[] ]},

                },
                viewsCount: {
                    $sum: { $ifNull: ["$videos.views",[] ]},
                }
            }
        },
        {
            $project:{
                fullName: 1,
                email:1,
                username: 1,
                avatar: 1,
                videosCount: 1,
                likesCount: 1,
                subscribersCount: 1,
                subscriberToCount: 1,
                viewsCount: 1,
    
            }
        }
       
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            channelStats,
            "Channel stats fetched successfully"
        )
    )

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user._id;

    const allUserVideos = await Video.aggregate([
        {
            $match:{
                owner: userId
            }
        },

        
        
    ])
    return res.status(200).json(
        new ApiResponse(
            200,
            allUserVideos,
            "Videos fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }