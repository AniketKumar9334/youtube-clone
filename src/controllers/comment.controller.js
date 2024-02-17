import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query


    const comments = await Comment.aggregate([
        {
            $match:{
                video: new mongoose.Types.ObjectId(videoId)
            },
            
        },
        {
            $skip: limit * (page - 1)
        },
        {
            $limit: limit
        },
        {
            $lookup:{
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline:[
                    {
                        $project:{
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                            email: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                owner: {
                    $first: "$owner"
                },
                
            }
        },
        
    ])


    res.status(200).json(new ApiResponse(200, comments, "comments retrieved successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body

    const video = await Video.findById(videoId)

    if(!content){
        throw new ApiError(400, "Please provide a comment")
    }

    if (!video) {
        throw new ApiError(404, "Video not found...")
    }

    const comment = await Comment.create({
        content,
        video: video._id,
        owner: req.user._id
    })

    res.status(201).json(new ApiResponse(201, comment, "comment add successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found...")
    }

    if (!content) {
        throw new ApiError(400, "Please provide a comment")
    }
    if(comment.owner.toString() !== req.user._id.toString() ){
        throw new ApiError(401, "You are not authorized to update this comment")
    }
    
    comment.content = content

    await comment.save()

    res.status(201).json(new ApiResponse(201, comment, "comment update successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found...")
    }

    if(comment.owner.toString()!== req.user._id.toString() ){
        throw new ApiError(401, "You are not authorized to delete this comment")
    }

    await Comment.findByIdAndDelete(commentId)

    res.status(201).json(new ApiResponse(200, {}, "comment delete successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
}
