const { Schema, model } = require('mongoose');
const UserShow = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    animeId: { type: Number, required: true },
    animeName: { type: String, required: true },
    watchCondition: { type: Schema.Types.ObjectId, ref: 'WatchCondition' },
    totalCountOfEpisodes: { type: Number },
    countOfEpisodes: { type: Number },
});

module.exports = model('UserShow', UserShow);
