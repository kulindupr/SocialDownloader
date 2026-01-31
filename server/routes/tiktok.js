import express from 'express';
import { getTikTokInfo, downloadTikTokStream } from '../controllers/tiktokController.js';

const router = express.Router();

router.post('/info', getTikTokInfo);
router.post('/download', downloadTikTokStream);

export default router;
