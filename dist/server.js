'use strict';

var http = require('http');
var port = process.env.PORT || 3000;
var app = require('./app');

/**
 * Creating server.
 */
var server = http.createServer(app);

/**
 * Listening to server port.
 */
server.listen(port);
//# sourceMappingURL=server.js.map