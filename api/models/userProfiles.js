const mongoose = require('mongoose');

const UserProfile = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    address: {type: String, required: true},
    dob: {type: String, required: true},
    user_id: {type: String, required: true},
    app_type: String,
    device_id: String,
    place: String,
    region: String,
    state: String,
    gender: String
});

module.exports = mongoose.model('UserProfile', UserProfile)
