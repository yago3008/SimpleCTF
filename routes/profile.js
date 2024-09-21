const express = require('express');
const router = express.Router();
const { downloadImageController, getImageController, getAllImagesController, runPhotoController } = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');

router
    .post('/download-image', authenticateToken, downloadImageController)
    .get('/get-image', authenticateToken, getImageController)
    .get('/get-all-images', getAllImagesController)
    .get('/run-photo', runPhotoController)
module.exports = router;