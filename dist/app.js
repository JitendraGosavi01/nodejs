'use strict';

var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/potato');

var usersRoutes = require('./api/routes/users');
var screenRoutes = require('./api/routes/screen');

/**
 * Middleware for keeping track for requested url.
 */
app.use(morgan('dev'));

/**
 * Middleware for parsing URL encoded data and JSON data.
 */
app.use(bodyParser.json());

/**
 * Middleware to handle CORS error.
 */
//app.use(cors()); or bellow
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //allowing all hosts to being send request
  res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); //accepting provided headers
  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Method", "PUT, POST, DELETE, GET, PATCH"); //allowing provided methods
    return res.status(200).json({});
  }
  next();
});

/**
 * Middleware for handling requests
 */
app.use('/users', usersRoutes);
app.use('/screens', screenRoutes);

/**
 * Handling invalid routes.
 */

app.use(function (req, res, next) {
  var error = new Error('Not Found!');
  error.status = 404;
  next(error);
});

/**
 * Handling errors occurred in page.
 */
app.use(function (error, req, res, next) {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
//# sourceMappingURL=app.js.map