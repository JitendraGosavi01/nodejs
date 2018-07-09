'use strict';

var jwt = require('jsonwebtoken');
var salt = require('../constants');
var httpStatus = require('../constants');

module.exports = function (req, res, next) {
    try {
        var token = req.headers.authorization.split(" ")[1];
        var decoded = jwt.verify(token, salt.JWT_TOKEN_SALT);
        req.userData = decoded;
        next();
    } catch (error) {
        res.status(httpStatus.HTTP_CODE.UNAUTHORIZED).json({
            message: "Authorization failed!"
        });
    }
};
//# sourceMappingURL=auth.js.map