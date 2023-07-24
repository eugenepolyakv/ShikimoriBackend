const jwt = require('jsonwebtoken');
const tokenService = require('../service/token-service');
module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: 'User is not authorized' });
        }

        const decodedData = tokenService.validateAccessToken(token);
        if (!decodedData) {
            return res.status(403).json({ message: 'Token is not valid' });
        }
        req.user = decodedData;
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({ message: 'User is not authorized' });
    }
};
