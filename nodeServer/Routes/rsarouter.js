import express from 'express';
import * as rsaController from '../Controllers/rsaController.js';

const router = express.Router();

// PUBLIC ROUTES
router.route('/getpublickey').get(rsaController.getTheLatestPublicKey);
router.route('/test').get(rsaController.TestRsa);

export default router;
