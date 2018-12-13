const helper = require('./server.lib-test.js');
const timeout = 30000;
const gameCount = 10;

/**
 * Plays <count> games of lucky21 using api test set up
 * @param {string} url base URL to lucky21 game API
 * @param {int} count number of times to play lucky21 game
 * @param {function} done callback to use when test has executed
 */
const playGames = (url, count, done) => {
  if (count === 0) {
    done();
    return;
  }
  // Creating a callback that works the same way as done in Jest.
  const playGameCallback = () => {
    playGames(url, count - 1, done);
  };
  playGameCallback.fail = done.fail;
  helper.playGame(url, playGameCallback);
};
/**
 * Capacity tests to check whether game can be played <gameCount> times within given time
 * Essentially testing basic performance (speed) and throughput of overall system
 */
test('play ' + gameCount + ' games within ' + (timeout / 1000) + ' seconds', (done) =>
  playGames(process.env.API_URL, gameCount, done),
timeout);