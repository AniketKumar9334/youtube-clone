import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    //TODO: create playlist
    if (!name || !description) {
        throw new ApiError(400, "All fields are required...");
    }

    const newPlaylist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
    });
    res.status(201).json(
        new ApiResponse(201, newPlaylist, "Playlist created successfully")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    //TODO: get user playlists

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline:[
                    {
                        $project:{
                            thumbnail: 1
                        }
                    }
                ]
            },
        },
        {
            $addFields: {
                videosCount: {
                    $size: "$videos",
                },
                videoThumbnail:{
                    $arrayElemAt: ["$videos", 0]
                },
            },
        },
        {
            $project:{
                name: 1,
                description: 1,
                videoThumbnail: 1,
                videosCount: 1,
                owner: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);
    let filterdPlayList = playlists[0]
    res.status(200).json(
        new ApiResponse(200, filterdPlayList, "Playlists fetched successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(404, "Playlist not found...");
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new Mongoose.Types.ObjectId(playlistId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
            },
        },
       
    ]);

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched successfully")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: add video to playlist

    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found...");
    }
    if (!video) {
        throw new ApiError(404, "Video not found...");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(401, "You are not authorized to add this video");
    }

    const isAddedToPlaylist = playlist.videos.includes(videoId);

    if (isAddedToPlaylist) {
        return res
            .status(200)
            .json(new ApiResponse(200, "Video is already in this playlist"));
    }

    playlist.videos.push(videoId);
    await playlist.save()
    res.status(200).json(new ApiResponse(200,{}, "Video add to playlist..."));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist

    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found...");
    }
    if (!video) {
        throw new ApiError(404, "Video not found...");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(401, "You are not authorized to remove this video");
    }

    const isAddedToPlaylist = await playlist.videos.includes(videoId);
    if (!isAddedToPlaylist) {
        return res
            .status(200)
            .json(new ApiResponse(400, "Video is not in this playlist"));
    }

    playlist.videos.pull(videoId);
    await playlist.save()
    res.status(200).json(
        new ApiResponse(400, "Video removed from playlist...")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: delete playlist
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found...");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            401,
            "You are not authorized to delete this playlist"
        );
    }

    await Playlist.findByIdAndDelete(playlistId);
    res.status(200).json(
        new ApiResponse(200, {}, "Playlist deleted successfully")
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found...");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            401,
            "You are not authorized to update this playlist"
        );
    }
    if (!name || !description) {
        throw new ApiError(400, "All fields are required...");
    }

    playlist.name = name;
    playlist.description = description;

    await playlist.save();

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist updated successfully")
    );
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
