import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

/**
 * GET ALL VIDEOS (with pagination, search & sort)
 */
const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query = "",
        sortBy = "createdAt",
        sortType = "desc",
        userId
    } = req.query

    const matchStage = {
        isPublished: true
    }

    if (query) {
        matchStage.title = { $regex: query, $options: "i" }
    }

    if (userId && isValidObjectId(userId)) {
        matchStage.owner = new mongoose.Types.ObjectId(userId)
    }

    const videos = await Video.aggregate([
        { $match: matchStage },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        },
        { $skip: (page - 1) * limit },
        { $limit: Number(limit) }
    ])

    res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    )
})

/**
 * PUBLISH A VIDEO
 */
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    const videoLocalPath = req.files?.video?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video and thumbnail are required")
    }

    const videoUpload = await uploadOnCloudinary(videoLocalPath)
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoUpload?.url) {
        throw new ApiError(500, "Video upload failed")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        duration: videoUpload.duration,
        owner: req.user._id,
        isPublished: true
    })

    res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    )
})

/**
 * GET VIDEO BY ID
 */
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId).populate(
        "owner",
        "username avatar"
    )

    if (!video || !video.isPublished) {
        throw new ApiError(404, "Video not found")
    }

    res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
})

/**
 * UPDATE VIDEO DETAILS
 */
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this video")
    }

    if (req.file?.path) {
        const thumbnailUpload = await uploadOnCloudinary(req.file.path)
        video.thumbnail = thumbnailUpload.url
    }

    if (title) video.title = title
    if (description) video.description = description

    await video.save()

    res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    )
})

/**
 * DELETE VIDEO
 */
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this video")
    }

    await video.deleteOne()

    res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})

/**
 * TOGGLE PUBLISH STATUS
 */
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized")
    }

    video.isPublished = !video.isPublished
    await video.save()

    res.status(200).json(
        new ApiResponse(
            200,
            { isPublished: video.isPublished },
            "Publish status updated"
        )
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}