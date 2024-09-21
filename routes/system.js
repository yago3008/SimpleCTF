const express = require('express');
const router = express.Router();
const { internalRequestMiddleware } = require('../middleware/auth');
const { execController } = require('../controllers/systemController');

router
    .get('/', execController)
    .get('/check-internal', internalRequestMiddleware, (req, res) =>{
        return res.status(200).json({ message: 'Requisição interna detectada e processada!' });
    });

module.exports = router;