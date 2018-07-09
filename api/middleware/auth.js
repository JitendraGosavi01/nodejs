const jwt = require('jsonwebtoken');
const salt = require('../constants');
const httpStatus = require('../constants');

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(token, salt.JWT_TOKEN_SALT);
        req.userData = decoded;
        next();
    } catch (error) {
        res.status(httpStatus.HTTP_CODE.UNAUTHORIZED)
            .json({
                message: "Authorization failed!"
            });
    }
}