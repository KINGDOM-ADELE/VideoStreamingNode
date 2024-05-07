import express from 'express';
const router = express.Router();

import * as authController from '../Controllers/authcontroller.js';
import * as videoStreamingController from '../Controllers/videoStreamingController.js';
import upload from '../Utils/filehandler.js';
import uploadCrypto from '../Utils/filehandlerCrypto.js';
import * as rsaController from '../Controllers/rsaController.js';


// ROUTES CHAINING for supportcv

router.route('/videoads')
    .get( videoStreamingController.getVideo )

router.route('/')
    .get(videoStreamingController.getVideos)
    .post(authController.protect, authController.filesToVideosPath, upload.array('files'), videoStreamingController.postVideo); // allows multiple files uploads
    // .post(authController.protect,authController.filesToFeedsPath,upload.array('files'),feedsController.postFeed) 

router.route('/crypto')
    .get(rsaController.DecryptHeaderData,videoStreamingController.getVideos)
    // .post(rsaController.DecryptHeaderData, authController.filesToVideosPath, upload.array('files'), videoStreamingController.postVideo); // allows multiple files uploads
    .post(rsaController.DecryptHeaderData,rsaController.DecryptData,rsaController.DecryptFiles,authController.protect, authController.filesToVideosPath, uploadCrypto.array('files'), videoStreamingController.postVideo); // allows multiple files uploads


router.route('/:_id')
    .get(videoStreamingController.getVideo)
    .patch(videoStreamingController.patchVideo)
    .put(authController.protect, videoStreamingController.putVideo)
    .delete(authController.protect, authController.restrict('admin'), videoStreamingController.deleteVideo); // for single role

export default router;
