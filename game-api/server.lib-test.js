const request = require('request');

/**
 * Plays an instance of Lucky21 game
 * @param {string} url base URL to lucky21 game API
 * @param {function} done callback to use when test has executed
 */
const playGame = (url, done) => {
  request.post(url + '/start', function(error, response, body) {
    if (error) {
      done.fail(error);
      return;
    }
    console.log('start: ' + response['statusCode'] + ' - ' + body);
    guessUntilGameIsOver(url, 12, done);
  });
};
/**
 * Plays Lucky21 game by guessing <maxGuesses> times on cards
 * @param {string} url base URL to lucky21 game API
 * @param {int} maxGuesses number of allowed guesses
 * @param {function} done callback to use when test has executed
 */
const guessUntilGameIsOver = (url, maxGuesses, done) => {
  if (maxGuesses === 0) {
    done.fail('the game is never over');
    return;
  }
  request.get(url + '/state', function(error, response, body) {
    if (error) {
      done.fail(error);
      return;
    }
    console.log('state: ' + response['statusCode'] + ' - ' + body);
    if (JSON.parse(body).gameOver) {
      done();
      return;
    }
    const possibilities = ['guess21OrUnder', 'guessOver21'];
    const guess = possibilities[Math.floor(Math.random() * 2)];
    request.post(url + '/' + guess, function(error, response, body) {
      if (error) {
        done.fail(error);
        return;
      }
      console.log('guess: ' + response['statusCode'] + ' - ' + body);
      guessUntilGameIsOver(url, maxGuesses - 1, done);
    });
  });
};
                              
module.exports = {
  playGame: playGame,
  guessUntilGameIsOver: guessUntilGameIsOver,
};