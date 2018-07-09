const mongoose = require('mongoose');
const Users = require('../models/users');
const httpStatus = require('../constants');
const salt = require('../constants');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Get all users.
 *
 * @param req
 * @param res
 * @param next
 */
exports.getAllUsers = (req, res, next) => {
    let host = req.protocol + '://' + req.headers.host;
    Users.find()
        .populate('profile', 'gender')
        .exec()
        .then(docs => {
            if (docs) {
                let response = {
                    count: docs.length,
                    users: docs.map(doc => {
                        return {
                            id: doc._id,
                            name: doc.name,
                            email: doc.email,
                            gender: doc.gender,
                            request: {
                                type: 'GET',
                                url: host + '/users/' + doc._id
                            }
                        }
                    })
                }
                res.status(httpStatus.HTTP_CODE.OK)
                    .json({
                        message: "User information",
                        response
                    })
            } else {
                res.status(httpStatus.HTTP_CODE.PAGE_NOT_FOUND)
                    .json({
                        message: "Users is not available!"
                    })
            }
        })
        .catch(error => {
            res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR)
                .json({
                    error: error
                })
        })
};

/**
 * Creating user.
 *
 * @param req
 * @param res
 * @param next
 */
exports.createUser = (req, res, next) => {

    let host = req.protocol + '://' + req.headers.host;
    Users.find({email: req.body.email})
        .exec()
        .then(user => {

            if (user.length >= 1) {
                return res.status(httpStatus.HTTP_CODE.CONFLICT).json({
                    message: 'Email already exists',
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR)
                            .json({
                                error: err
                            })
                    } else {
                        let user = new Users({
                            _id: mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            role: 0
                        });
                        user.save()
                            .then(result => {
                                res.status(httpStatus.HTTP_CODE.OK)
                                    .json({
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
                            })
                            .catch(error => {
                                res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR)
                                    .json({
                                        error: error
                                    })
                            });
                    }
                });
            }
        })
        .catch(error => {
            res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR)
                .json({
                    error: error
                })
        });

};

/**
 * Creating user profile.
 * @param req
 * @param res
 * @param next
 */
exports.createProfile = (req, res, next) => {
    let host = req.protocol + '://' + req.headers.host;
    let profile = new UserProfile({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        address: req.body.address,
        dob: req.body.dob,
        user_id: req.body.user_id,
        app_type: req.body.app_type,
        device_id: req.body.device_id,
        place: req.body.place,
        region: req.body.region,
        gender: req.body.gender,
    });
    profile.save()
        .then(result => {
            res.status(httpStatus.HTTP_CODE.OK)
                .json({
                    message: "User Profile created successfully",
                    request: {
                        type: 'GET',
                        description: 'You can get UserProfile from below Request.',
                        url: host + '/users/profile/' + result._id
                    }
                });
        })
        .catch(error => {
            res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR)
                .json({
                    error: error
                })
        });
};

/**
 * Getting user By Id.
 *
 * @param req
 * @param res
 * @param next
 */
exports.getUser = (req, res, next) => {
    let userId = req.params.userId;
    Users.findById({_id: userId})
        .exec()
        .then(doc => {
            if (doc) {
                res.status(httpStatus.HTTP_CODE.OK)
                    .json({
                        message: "User information for " + userId,
                        userInformation: doc
                    })
            } else {
                res.status(httpStatus.HTTP_CODE.PAGE_NOT_FOUND)
                    .json({
                        message: "User is not available for this user id " + userId
                    })
            }
        })
        .catch(error => {
            res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR)
                .json({
                    error: error
                })
        })
};

/**
 * Getting profile by ID.
 *
 * @param req
 * @param res
 * @param next
 */
exports.getProfile = (req, res, next) => {
    let profileId = req.params.profileId;
    UserProfile.findById({_id: profileId})
        .exec()
        .then(doc => {
            if (doc) {
                res.status(httpStatus.HTTP_CODE.OK)
                    .json({
                        message: "User information for " + profileId,
                        userInformation: doc
                    })
            } else {
                res.status(httpStatus.HTTP_CODE.PAGE_NOT_FOUND)
                    .json({
                        message: "User is not available for this user id " + profileId
                    })
            }
        })
        .catch(error => {
            res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR)
                .json({
                    error: error
                })
        })
};

/**
 * Deleting user By id.
 *
 * @param req
 * @param res
 * @param next
 */
exports.deleteUser = (req, res, next) => {
    let userId = req.params.userId;
    Users.findById({_id: userId})
        .exec()
        .then(doc => {
            if (doc) {
                Users.findByIdAndRemove({_id: userId})
                    .exec()
                    .then(result => {
                        res.status(httpStatus.HTTP_CODE.OK)
                            .json({
                                message: "User deleted for user id " + userId
                            })
                    })
                    .catch(error => {
                        res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR)
                            .json({
                                error
                            })
                    })
            } else {
                res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR)
                    .json({
                        message: 'User is already deleted.'
                    })
            }
        })
        .catch(error => {
            res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR)
                .json({
                    message: error
                })
        })
};

/**
 * Updating user By id.
 *
 * @param req
 * @param res
 * @param next
 */
exports.updateUser = (req, res, next) => {
    let userId = req.params.userId;
    Users.update({_id: userId}, {
        $set: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }
    }).exec()
        .then(result => {
            res.status(httpStatus.HTTP_CODE.OK)
                .json({
                    message: "User has been updated successfully",
                    updated_user: result
                })
        })
        .catch(error => {
            res.status(httpStatus.HTTP_CODE.INTERNAL_SERVER_ERROR)
                .json({
                    message: "Failed to update information!",
                    error: error
                })
        })
};

exports.userLogin = (req, res, next) => {
    Users.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(httpStatus.HTTP_CODE.UNAUTHORIZED)
                    .json({
                        message: "Authentication failed!",
                    });
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {

                    if (result) {
                        const token = jwt.sign({
                            email: user[0].email,
                            userid: user[0]._id
                        }, salt.JWT_TOKEN_SALT, {
                            expiresIn: '1hr'
                        });
                        res.status(httpStatus.HTTP_CODE.OK)
                            .json({
                                message: "Authentication success",
                                token: token
                            })
                    } else {
                        res.status(httpStatus.HTTP_CODE.UNAUTHORIZED)
                            .json({
                                message: "Authentication failed!",
                            });
                    }
                });
            }
        })
        .catch(err => {
            res.status(httpStatus.HTTP_CODE.UNAUTHORIZED)
                .json({
                    message: err,
                });
        });
};


