const jwt = require('jsonwebtoken');
const tokenService = require('../service/token-service');
const { refresh } = require('../authController');
module.exports = async function checkIfTokenValidMiddleware(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const accessToken = req.headers?.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(403).json({ message: 'User is not authorized' });
        }
        jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        // if (Date.now() >= exp * 1000) {
        //     console.log('TOKEN HAS BEEN EXPIRED, REFRESHING BOTH TOKENS');
        //     return res.status(403).json({ message: 'Token has expired' });
        // }
        next();
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return res.status(403).json({ message: 'Token has expired' });
        }
        return res.status(403).json('Check Token Error');
    }
};
