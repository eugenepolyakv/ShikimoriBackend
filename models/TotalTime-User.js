const { Schema, model } = require('mongoose');
const TotalTimeUser = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    totalTime: { type: Number },
});

module.exports = model('TotalTimeUser', TotalTimeUser);
