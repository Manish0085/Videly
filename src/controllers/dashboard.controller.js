import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

/**
 * GET CHANNEL STATS
 * total views, subscribers, videos, likes
 */
const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id

    const stats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId),
                isPublished: true
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" }
            }
        }
    ])

    const subscribersCount = await Subscription.countDocuments({
        channel: channelId
    })

    const likesCount = await Like.countDocuments({
        video: {
            $in: await Video.find({ owner: channelId }).distinct("_id")
        }
    })

    res.status(200).json(
        new ApiResponse(200, {
            totalVideos: stats[0]?.totalVideos || 0,
            totalViews: stats[0]?.totalViews || 0,
            totalSubscribers: subscribersCount,
            totalLikes: likesCount
        }, "Channel stats fetched successfully")
    )
})

/**
 * GET ALL VIDEOS OF A CHANNEL
 */
const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user._id
    const { page = 1, limit = 10 } = req.query

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: Number(limit) }
    ])

    res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    )
})

export {
    getChannelStats,
    getChannelVideos
}