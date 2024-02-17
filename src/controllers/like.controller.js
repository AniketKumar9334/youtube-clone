import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user._id
    //TODO: toggle like on video
    const isVideoLike = await Like.findOne({$and:[{likedBy: userId}, {video: videoId}]});

    if(isVideoLike){
        await Like.findByIdAndDelete(isVideoLike._id)
        return res.status(200).json(
            new ApiResponse(200, {}, "Like removed successfully")
        )
    }else{
        await Like.create({
            video: videoId,
            likedBy: userId
        })
        return res.status(200).json(
            new ApiResponse(200, {}, "Like added successfully")
        )
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user._id
    //TODO: toggle like on video
    const isCommentLike = await Like.findOne({$and:[{likedBy: userId}, {comment: commentId}]});

    if(isCommentLike){
        await Like.findByIdAndDelete(isCommentLike._id)
        return res.status(200).json(
            new ApiResponse(200, {}, "Like removed successfully")
        )
    }else{
        await Like.create({
            comment: commentId,
            likedBy: userId
        })
        return res.status(200).json(
            new ApiResponse(200, {}, "Like added successfully")
        )
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user._id
    //TODO: toggle like on tweet

    const isTweetLike = await Like.findOne({$and:[{likedBy: userId}, {tweet: tweetId}]});

    if(isTweetLike){
        await Like.findByIdAndDelete(isTweetLike._id)
        return res.status(200).json(
            new ApiResponse(200, {}, "Like removed successfully")
        )
    }else{
        await Like.create({
            tweet: tweetId,
            likedBy: userId
        })
        return res.status(200).json(
            new ApiResponse(200, {}, "Like added successfully")
        )
    }

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const userId = req.user._id;
    // const likes = await Like.find({likedBy: userId})
    let likeVideo = []
    

    const likes = await Like.aggregate([
        {
            $match:{
                likedBy: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort:{
                "video": 1
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                
            }
        },
        {
            $addFields:{
                video:{
                    $arrayElemAt: ["$video", 0]
                }
            }
        }
        
    ])
    likes.map(async (item)=>{
        if(item.video){
            likeVideo.push(item)
        }
    })
  
    res.status(200).json(
        new ApiResponse(
            200,
            likeVideo,
            "Liked videos fetched successfully"
        )
    ) 
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}