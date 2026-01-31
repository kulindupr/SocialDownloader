import express from 'express';
import { getInstagramInfo, downloadInstagramStream } from '../controllers/instagramController.js';

const router = express.Router();

router.post('/info', getInstagramInfo);
router.post('/download', downloadInstagramStream);

export default router;
