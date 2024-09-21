const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUserService = async (username, password) => {
    const userExists = await User.findOne({ where: { username } })
    if (userExists){
        throw new Error('username already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, password: hashedPassword });
};

const generateTokenService = (userId)  => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};


const loginUserService = async (username, password) =>{
    const user = await User.findOne({ where: { username } });
    if (!user){
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
        throw new Error('Invalid credentials');
    }

    const token = generateTokenService(user.id);
    
    return { user, token };
};

const changePasswordService = async (userId, password) => {
    const user = await User.findByPk(userId);
    if (!user){
        throw new Error('User not found');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
}

module.exports = { registerUserService, loginUserService, changePasswordService };

