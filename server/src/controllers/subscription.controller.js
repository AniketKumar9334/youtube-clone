import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
   const userId = req.user._id;

    const subscription = await Subscription.findOne({$and:[{channel: channelId}, {subscriber: userId}]})
    if(subscription){
        await Subscription.findByIdAndDelete(subscription._id)
        return res.status(200).json(
            new ApiResponse(200, {}, "Subscription removed successfully")
        )
    }else{
        await Subscription.create({
            channel: channelId,
            subscriber: userId
        })
        return res.status(201).json(
            new ApiResponse(201, {}, "Subscription successfully")
        )
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const subscribers = await Subscription.find({channel: channelId})
    if(!subscribers) {
        throw new ApiError(404, "channel does not exists")
    }
    res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const subscriptions = await Subscription.find({subscriber: subscriberId})
    if(!subscriptions) {
        throw new ApiError(404, "channel does not exists")
    }
    res.status(200).json(
        new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}