'use strict';

var express = require('express');
var router = express.Router({});
var userController = require('../controller/userController');
var auth = require('../middleware/auth');

/**
 * HTTP METHODS OR ROUTES TO BEING PERFORM OPERATION ON USER.
 */
router.get('/', auth, userController.getAllUsers);
router.post('/', userController.createUser);
router.post('/profile', userController.createProfile);
router.get('/profile/:profileId', userController.getProfile);
router.get('/:userId', userController.getUser);
router.delete('/:userId', auth, userController.deleteUser);
router.patch('/:userId', auth, userController.updateUser);
router.post('/login', userController.userLogin);
/**
 * @type {Router|router|*}
 */
module.exports = router;
//# sourceMappingURL=users.js.map