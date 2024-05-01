import express from 'express';
import * as authController from '../Controllers/authcontroller.js';

const router = express.Router();

// PUBLIC ROUTES
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotpassword').post(authController.forgotpassword);
// router.route('/verifyemail').post(authController.verifyEmail);
// router.route('/resetpassword/:Token').patch(authController.resetpassword);

// PROTECTED ROUTES
// router.route('/approve/:_id').patch(authController.protect, authController.restrict('admin'), authController.approveUser);
// router.route('/setuserstatus/:_id').patch(authController.protect, authController.restrict('admin'), authController.setUserStatus);
// router.route('/myprofile').get(authController.protect, authController.getMyProfile);
// router.route('/searchuser').get(authController.protect, authController.searchUsers);
// router.route('/changePassword').put(authController.protect, authController.changePassword).patch(authController.protect, authController.changePassword);
// router.route('/logoutall').put(authController.protect, authController.logOutAll).patch(authController.protect, authController.logOutAll);
router.route('/').get(authController.getUsers);
// router.route('/').get(authController.protect, authController.getUsers).put(authController.protect, authController.updateUser).patch(authController.protect, authController.updateUser);

export default router;
