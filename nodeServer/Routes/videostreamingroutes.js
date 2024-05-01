import express from 'express';
const router = express.Router();

import * as authController from '../Controllers/authcontroller.js';
import * as videoStreamingController from '../Controllers/videoStreamingController.js';
import upload from '../Utils/filehandler.js';

// ROUTES CHAINING for supportcv

router.route('/videoads')
    .get( videoStreamingController.getVideo )

router.route('/')
    .get(videoStreamingController.getVideos)
    .post(authController.protect, authController.filesToVideosPath, upload.array('files'), videoStreamingController.postVideo); // allows multiple files uploads

router.route('/:_id')
    .get(videoStreamingController.getVideo)
    .patch(videoStreamingController.patchVideo)
    .put(authController.protect, videoStreamingController.putVideo)
    .delete(authController.protect, authController.restrict('admin'), videoStreamingController.deleteVideo); // for single role

export default router;
