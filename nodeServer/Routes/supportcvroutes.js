import express from 'express';
const router = express.Router();

import * as supportcvController from '../Controllers/supportcvController.js';
import * as authController from '../Controllers/authcontroller.js';
import upload from '../Utils/filehandler.js';

// ROUTES CHAINING for supportcv
router.route('/')
    .get(authController.protect, supportcvController.getSupportcvs)
    .post(authController.protect, authController.filesTosupportcvsPath, upload.array('files'), supportcvController.postSupportcv); // allows multiple files uploads

router.route('/:_id')
    .get(authController.protect, supportcvController.getSupportcv)
    .patch(authController.protect, supportcvController.patchSupportcv)
    .put(authController.protect, supportcvController.putSupportcv)
    .delete(authController.protect, authController.restrict('admin'), supportcvController.deleteSupportcv); // for single role

export default router;
