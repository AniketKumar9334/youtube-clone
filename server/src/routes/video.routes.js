import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    getVideoDetailsIChunks,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/videoMulter.midleware.js   "

const router = Router();

router
    .route("/")
    .get(verifyJWT,getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        verifyJWT,
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(verifyJWT, deleteVideo)
    .patch(upload.single("thumbnail"),verifyJWT, updateVideo);

router.route("/video-stream/:videoId").get(getVideoDetailsIChunks)
router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default router