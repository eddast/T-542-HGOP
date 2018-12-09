const helper = require('./server.lib-test.js');
const timeout = 30000;

/**
 * Executes api end-to-end test on server via Jest
 */
test('play a game', (done) =>
  // Uses environment variable API_URL to use as base URL to lucky21 API
  // done callback function called when test has executed
  helper.playGame(process.env.API_URL, done),
timeout);