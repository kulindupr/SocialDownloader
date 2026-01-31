import express from 'express';
import { getYouTubeInfo, downloadYouTubeStream, getPlaylistInfo, downloadPlaylist, downloadSelectedPlaylist } from '../controllers/youtubeController.js';

const router = express.Router();

router.post('/info', getYouTubeInfo);
router.post('/download', downloadYouTubeStream);
router.post('/playlist/info', getPlaylistInfo);
router.post('/playlist/download', downloadPlaylist);
router.post('/playlist/download-selected', downloadSelectedPlaylist);

export default router;
