const Router = require('express');
const router = new Router();
const controller = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const checkIfTokenValidMiddleware = require('../middlewares/checkIfTokenExpiredMiddleware');
router.post('/registration', controller.registration);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/refresh', controller.refresh);

// router.get('/checkIfExpired', controller.checkIfExpired);

// router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers);
router.post('/userInfo', checkIfTokenValidMiddleware, controller.userInfo);
router.get('/users', checkIfTokenValidMiddleware, controller.getUsers);
module.exports = router;
