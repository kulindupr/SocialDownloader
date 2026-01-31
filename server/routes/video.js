import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { getVideoInfo, downloadVideoStream, downloadAudioStream } from '../controllers/videoController.js';

const router = Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg
    });
  }
  next();
};

router.post(
  '/info',
  [
    body('url')
      .trim()
      .notEmpty()
      .withMessage('URL is required')
      .isURL()
      .withMessage('Please provide a valid URL')
  ],
  validateRequest,
  getVideoInfo
);

router.post(
  '/download',
  [
    body('url')
      .trim()
      .notEmpty()
      .withMessage('URL is required')
      .isURL()
      .withMessage('Please provide a valid URL'),
    body('height')
      .notEmpty()
      .withMessage('Quality is required')
      .isInt({ min: 144, max: 4320 })
      .withMessage('Invalid quality value')
  ],
  validateRequest,
  downloadVideoStream
);

router.post(
  '/download-audio',
  [
    body('url')
      .trim()
      .notEmpty()
      .withMessage('URL is required')
      .isURL()
      .withMessage('Please provide a valid URL')
  ],
  validateRequest,
  downloadAudioStream
);

export default router;
