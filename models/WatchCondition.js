const { Schema, model } = require('mongoose');

const WatchCondition = new Schema({
    condition: { type: String, unique: true, required: true },
});

module.exports = model('WatchCondition', WatchCondition);
