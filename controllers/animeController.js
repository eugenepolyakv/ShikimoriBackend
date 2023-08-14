const WatchCondition = require('../models/WatchCondition');
const UserShow = require('../models/User-Show');
const User = require('../models/User');
const tokenModel = require('../models/TokenModel');
class AnimeController {
    async addAnimeToTheList(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const { user: userID } = await tokenModel.findOne({
                refreshToken: `${refreshToken}`,
            });
            console.log(userID);
            const { user } = await User.findById({ userID });
            res.json({ user });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Add anime error' });
        }
    }
}

module.exports = new AnimeController();
