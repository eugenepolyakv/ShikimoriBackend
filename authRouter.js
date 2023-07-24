const Router = require('express');
const router = new Router();
const controller = require('./authController');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

router.post('/registration', controller.registration);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/refresh', controller.refresh);
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers);

module.exports = router;
