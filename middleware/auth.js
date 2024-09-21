const jwt = require('jsonwebtoken');
require('dotenv').config(); // Para acessar as variáveis de ambiente

// Middleware para verificar o token JWT
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];  // Pega o token do cabeçalho

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Decodifica o token e atribui o usuário à requisição
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

const internalRequestMiddleware = (req, res, next) => {
    const clientIp = req.connection.remoteAddress || req.socket.remoteAddress;
    const isLoopback = ['127.0.0.1', '::1'].includes(clientIp);

    if (isLoopback) {
        next();
    } else {
        return res.status(403).json({ message: 'Acesso negado. Requisição externa ou não verificada.' });
    }
};

module.exports = { authenticateToken, internalRequestMiddleware };
