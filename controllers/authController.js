const { registerUserService, loginUserService, changePasswordService } = require('../services/authService');

const registerController = async (req, res) => {

    const { username, password } = req.body;

    try{
        const newUser = await registerUserService(username, password);
        return res.status(200).json({ message: 'user registered successfully', user: newUser });
    } catch(err){
        return res.status(500).json({ error: err.message }); 
    };
};

const loginController = async (req, res) => {
    const { username, password } = req.body;
    try{
        const user = await loginUserService(username, password);
        return res.status(200).json({ message: 'login successfully', user: user });
    } catch(err){
        return res.status(401).json({ error: err.message }); 
    }
};

const changePasswordController = async (req, res) => {
    const { password } = req.body;
    const userId = req.user.id;

    try{
        response = await changePasswordService(userId, password);
        res.status(200).json({ message: 'change password successfully', reponse: response });
    } catch(err){
        res.status(400).json({ error: err.message });
    }
};


module.exports = { registerController, loginController, changePasswordController };