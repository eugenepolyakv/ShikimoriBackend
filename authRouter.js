const Router = require('express');
const router = new Router();
const controller = require('./authController');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
const checkIfTokenValidMiddleware = require('./middleware/checkIfTokenExpiredMiddleware');
router.post('/registration', controller.registration);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/refresh', controller.refresh);

// router.get('/checkIfExpired', controller.checkIfExpired);

// router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers);
router.get('/userInfo', checkIfTokenValidMiddleware, controller.userInfo);
router.get('/users', checkIfTokenValidMiddleware, controller.getUsers);
module.exports = router;
