'use strict';

var mongoose = require('mongoose');

var User = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    //profile : {type : mongoose.Schema.Types.ObjectId,ref : 'UserProfile',required :true},
    email: { type: String, email: true },
    password: { type: String, required: true },
    role: { type: Number, required: true }
});

module.exports = mongoose.model('Users', User);
//# sourceMappingURL=users.js.map