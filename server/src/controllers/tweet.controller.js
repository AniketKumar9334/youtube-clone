import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import {Like} from '../models/like.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content is required...");
  }
  const newTweet = await Tweet.create({
    content,
    owner: req.user._id,
  });
  res
    .status(201)
    .json(new ApiResponse(201, newTweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const tweets = await Tweet.aggregate([
    {
      $match: {
        owner: req.user._id,
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
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);
  res
    .status(200)
    .json(new ApiResponse(true, 200, tweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;
  const tweet = await Tweet.findById(tweetId)
  if (!content) {
    throw new ApiError(400, "Content is required...");
  }
  if(!tweet){
    throw new ApiError(400, "Tweet not found...")
  }
  if(tweet.owner.toString() !== req.user._id.toString()){
    throw new ApiError(401, "You are not authorized to update this tweet")
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { content },
    { new: true, runValidators: false }
  );
  res
   .status(200)
   .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  const tweet = await Tweet.findById(tweetId)
 
  if(!tweet){
    throw new ApiError(400, "Tweet not found...")
  }
  if(tweet.owner.toString() !== req.user._id.toString()){
    throw new ApiError(401, "You are not authorized to delete this tweet")
  }

  const tweetLikes = await Like.find({tweet: tweetId})
  tweetLikes.map(async (like)=>{
    await like.remove()
  })
  await Tweet.findByIdAndDelete(tweetId);
  res
   .status(200)
   .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
