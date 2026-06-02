const serverless = require('serverless-http');
const app = require('../../server'); // imports the Express app from server.js

module.exports.handler = serverless(app);
