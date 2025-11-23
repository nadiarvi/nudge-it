const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const checkAuthUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Authentication failed!');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed!');
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = { id: decodedToken.id };
        next();
    } catch (err) {
        console.log('auth', err)
        const error = new HttpError('Authentication failed!', 401);
        return next(error);
    }
};

const decodeToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = { id: decodedToken.id };
        next();
    } catch (err) {
        next();
    }
}

module.exports = { checkAuthUser, decodeToken }