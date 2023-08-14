const Router = require('express');
const router = new Router();
const controller = require('../controllers/animeController');

router.post('/addAnime', controller.addAnimeToTheList);
module.exports = router;
