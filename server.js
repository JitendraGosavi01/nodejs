const http = require('http');
const port = process.env.PORT || 3000;
const app  = require('./app');

/**
 * Creating server.
 */
const server = http.createServer(app);

/**
 * Listening to server port.
 */
server.listen(port);

