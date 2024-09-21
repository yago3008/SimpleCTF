const express = require('express');
const router = express.Router();
const { registerController, loginController, changePasswordController } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');



router
    .post('/register', registerController)
    .post('/login', loginController)
    .get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'You are authenticated', user: req.user });
})
    .post('/change-password', authenticateToken, changePasswordController);

module.exports = router;