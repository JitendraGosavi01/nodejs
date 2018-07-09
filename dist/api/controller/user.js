'use strict';

var mongoose = require('mongoose');
var Users = require('../models/users');
var UserProfile = require('../models/userProfiles');
var httpStatus = require('../constants');
var bcrypt = require('bcrypt');

/**
 * Get all users.
 *
 * @param req
 * @param res
 * @param next
 */
exports.getAllUsers = function (req, res, next) {
    var host = req.protocol + '://' + req.headers.host;
    Users.find().populate('profile', 'gender').exec().then(function (docs) {
        if (docs) {
            var response = {
                count: docs.length,
                users: docs.map(function (doc) {
                    return {
                        id: doc._id,
                        name: doc.name,
                        email: doc.email,
                        gender: doc.gender,
                        request: {
                            type: 'GET',
                            url: host + '/users/' + doc._id
                        }
                    };
                })
            };
            res.status(httpStatus.HTTP_CODE.OK).json({
                message: "User information",
                response: response
            });
        } else {
            res.status(httpStatus.HTTP_CODE.PAGE_NOT_FOUND).json({
                message: "Users is not available!"
            });
        }
    }).catch(function (error) {
        res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR).json({
            error: error
        });
    });
};

/**
 * Creating user.
 *
 * @param req
 * @param res
 * @param next
 */
exports.createUser = function (req, res, next) {

    var host = req.protocol + '://' + req.headers.host;
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) {
            return res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR).json({
                error: err
            });
        } else {
            var user = new Users({
                _id: mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                password: hash,
                remember_token: req.body.remember_token,
                role: 0
            });
            user.save().then(function (result) {
                res.status(httpStatus.HTTP_CODE.OK).json({
                    message: "User created successfully",
                    createdUser: {
                        id: result._id,
                        name: result.name,
                        email: result.email,
                        password: result.password,
                        request: {
                            type: 'GET',
                            url: host + '/users/' + result._id
                        }
                    }
                });
            }).catch(function (error) {
                res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR).json({
                    error: error
                });
            });
        }
    });
};

/**
 * Creating user profile.
 * @param req
 * @param res
 * @param next
 */
exports.createProfile = function (req, res, next) {
    var host = req.protocol + '://' + req.headers.host;
    var profile = new UserProfile({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        address: req.body.address,
        dob: req.body.dob,
        user_id: req.body.user_id,
        app_type: req.body.app_type,
        device_id: req.body.device_id,
        place: req.body.place,
        region: req.body.region,
        gender: req.body.gender
    });
    profile.save().then(function (result) {
        res.status(httpStatus.HTTP_CODE.OK).json({
            message: "User Profile created successfully",
            request: {
                type: 'GET',
                description: 'You can get UserProfile from below Request.',
                url: host + '/users/profile/' + result._id
            }
        });
    }).catch(function (error) {
        res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR).json({
            error: error
        });
    });
};

/**
 * Getting user By Id.
 *
 * @param req
 * @param res
 * @param next
 */
exports.getUser = function (req, res, next) {
    var userId = req.params.userId;
    Users.findById({ _id: userId }).exec().then(function (doc) {
        if (doc) {
            res.status(httpStatus.HTTP_CODE.OK).json({
                message: "User information for " + userId,
                userInformation: doc
            });
        } else {
            res.status(httpStatus.HTTP_CODE.PAGE_NOT_FOUND).json({
                message: "User is not available for this user id " + userId
            });
        }
    }).catch(function (error) {
        res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR).json({
            error: error
        });
    });
};

/**
 * Getting profile by ID.
 *
 * @param req
 * @param res
 * @param next
 */
exports.getProfile = function (req, res, next) {
    var profileId = req.params.profileId;
    UserProfile.findById({ _id: profileId }).exec().then(function (doc) {
        if (doc) {
            res.status(httpStatus.HTTP_CODE.OK).json({
                message: "User information for " + profileId,
                userInformation: doc
            });
        } else {
            res.status(httpStatus.HTTP_CODE.PAGE_NOT_FOUND).json({
                message: "User is not available for this user id " + profileId
            });
        }
    }).catch(function (error) {
        res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR).json({
            error: error
        });
    });
};

/**
 * Deleting user By id.
 *
 * @param req
 * @param res
 * @param next
 */
exports.deleteUser = function (req, res, next) {
    var userId = req.params.userId;
    Users.findById({ _id: userId }).exec().then(function (doc) {
        if (doc) {
            Users.findByIdAndRemove({ _id: userId }).exec().then(function (result) {
                res.status(httpStatus.HTTP_CODE.OK).json({
                    message: "User deleted for user id " + userId
                });
            }).catch(function (error) {
                res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR).json({
                    error: error
                });
            });
        } else {
            res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR).json({
                message: 'User is already deleted.'
            });
        }
    }).catch(function (error) {
        res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR).json({
            message: error
        });
    });
};

/**
 * Updating user By id.
 *
 * @param req
 * @param res
 * @param next
 */
exports.updateUser = function (req, res, next) {
    var userId = req.params.userId;
    Users.update({ _id: userId }, {
        $set: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
    }).exec().then(function (result) {
        res.status(httpStatus.HTTP_CODE.OK).json({
            message: "User has been updated successfully",
            updated_user: result
        });
    }).catch(function (error) {
        res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR).json({
            message: "Failed to update information!",
            error: error
        });
    });
};
//# sourceMappingURL=user.js.map