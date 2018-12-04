/********************************************
 * UNIT TESTS FUNCTIONALITY OF LUCKY21 GAME *
 ********************************************/
const deckConstructor = require('./deck.js');
const dealerConstructor = require('./dealer.js');
const lucky21Constructor = require('./lucky21.js');


/********************
 * HELPER FUNCTIONS *
 ********************/
/**
* Initialize regular instance of lucky21 game
* @return lucky21 game object
*/
const initializeLucky21Game = () => {
  const deck = deckConstructor();
  const dealer = dealerConstructor();
  return lucky21Constructor(deck, dealer);
};
/**
* Initialize known test environment
* Sets up subset of a deck with four cards and disables shuffling
* @return lucky21 game object
*/
const initializeGameWithDeckSubsetAndNoShuffle = () => {
  const dealer = dealerConstructor();
  let deck = deckConstructor();
  deck = ['05L', '01D', '09S', '10H'];
  dealer.shuffle = deck => { /* Override the shuffle to do nothing */ };
  return lucky21Constructor(deck, dealer);
};


/****************************
 * TEST GAME INITIALIZATION *
 ****************************/
describe('test game initialization', () => {
  test('a new game should have 50 cards left in the deck', () => {
    const game = initializeLucky21Game();
    expect(game.state.deck.length).toEqual(50);
  });
  test('a new game should have 2 drawn cards', () => {
    const game = initializeLucky21Game();
    expect(game.state.cards.length).toEqual(2);
  });
});


/**********************
 * TEST FUNCTIONALITY *
 **********************/

/** isGameOver **/
describe('isGameOver functionality', () => {
  test('isGameOver player looses after guessing 21 or under when cards array is 20 and next card is 3', () => {
    const game = initializeLucky21Game();
    game.state.deck = [ '3H' ];
    game.state.cards = [ '01H', '12H', '9H' ];
    expect(game.isGameOver(game)).toEqual(false);
    game.guess21OrUnder(game);
    expect(game.isGameOver(game)).toEqual(true);
  });
  test('isGameOver player wins after guessing over 21 when cards array is 20 and next card is 3 which concludes game', () => {
    const game = initializeLucky21Game();
    game.state.deck = [ '3H' ];
    game.state.cards = [ '01H', '12H', '09H' ];
    expect(game.isGameOver(game)).toEqual(false);
    game.guessOver21(game);
    expect(game.isGameOver(game)).toEqual(true);
  });
  test('isGameOver game is still ongoing if player guesses 21 or under when cards array is 15 and next card is 3', () => {
    const game = initializeLucky21Game();
    game.state.deck = [ '3H' ];
    game.state.cards = [ '01H', '04H' ];
    expect(game.isGameOver(game)).toEqual(false);
    game.guess21OrUnder(game);
    expect(game.isGameOver(game)).toEqual(false);
  });
});
/** playerWon **/
describe('playerWon functionality', () => {
  test('playerWon player wins after guessing over 21 when cards array is 20 and next card is 3', () => {
    const game = initializeLucky21Game();
    game.state.deck = ['3H'];
    game.state.cards = ['01H', '12H', '09H'];
    expect(game.playerWon(game)).toEqual(false);
    game.guessOver21(game);
    expect(game.playerWon(game)).toEqual(true);
  });
  test('playerWon player does not win after guessing under 21 when cards array is 10 and next card is 3', () => {
    const game = initializeLucky21Game();
    game.state.deck = ['3H'];
    game.state.cards = ['04H', '06H'];
    expect(game.playerWon(game)).toEqual(false);
    game.guessOver21(game);
    expect(game.playerWon(game)).toEqual(false);
  });
});

/** getCardsValue **/
describe('getCardsValue functionality', () => {
  test('getCardsValue returns 14 given cards that have values 3, 6, 5', () => {
    const game = initializeLucky21Game();
    game.state.cards = ['03H', '06C', '05D'];
    expect(game.getCardsValue(game)).toEqual(14);
  });
  test('getCardsValue returns 20 instead of 30 given Queen, 9 and ace (favors user in terms of ace)', () => {
    const game = initializeLucky21Game();
    game.state.cards = ['12H', '9H', '01H'];
    expect(game.getCardsValue(game)).toEqual(20);
  });
  test('getCardsValue returns 14 given all aces (only first one evaluated to 11, latter aces to 1)', () => {
    const game = initializeLucky21Game();
    game.state.cards = ['01H', '01C', '01D', '01S'];
    expect(game.getCardsValue(game)).toEqual(14);
  });
  test('getCardsValue returns 20 given ace FIRST, then Queen and 9 (evaluates aces last)', () => {
    const game = initializeLucky21Game();
    game.state.cards = ['01H', '12H', '9H'];
    expect(game.getCardsValue(game)).toEqual(20);
  });
});

/** getCardValue **/
describe('getCardValue functionality', () => {
  test('getCardValue returns undefined if card does not exist', () => {
    const game = initializeLucky21Game();
    game.state.card = undefined;
    expect(game.getCardValue(game)).toEqual(undefined);
  });
  test('getCardValue returns 10 if card is Jack, King or Queen', () => {
    const game = initializeLucky21Game();
    game.state.deck = ['11H', '12H', '13H'];  // set deck to only Jack, King and Queen
    while (game.state.deck.length !== 0) {     // all cards in deck should then have value 10
      game.state.card = game.state.dealer.draw(game.state.deck);
      expect(game.getCardValue(game)).toEqual(10);
    }
  });
  test('getCardValue returns 11 if card is ace', () => {
    const game = initializeLucky21Game();
    game.state.card = '01H';                      // set card to ace
    expect(game.getCardValue(game)).toEqual(11);  // should equal 11
  });
});

/** getTotal **/
describe('getTotal functionality', () => {
  test('getTotal returns 14 given cards that have values 3, 6 and card with value 5', () => {
    const game = initializeLucky21Game();
    game.state.cards = ['03H', '06C'];
    game.state.card = '05H';
    expect(game.getTotal(game)).toEqual(14);
  });
  test('getTotal returns 9 given cards that have values 3, 6 and card that does not exist (only evaluates cards in that case)', () => {
    const game = initializeLucky21Game();
    game.state.cards = ['03H', '06C'];
    game.state.card = undefined;
    expect(game.getTotal(game)).toEqual(9);
  });
  test('getTotal returns 31 given cards ace, Queen and 9 and ace as card', () => {
    const game = initializeLucky21Game();
    game.state.cards = ['01H', '12H', '9H'];
    game.state.card = '01C';
    expect(game.getTotal(game)).toEqual(31);
  });
});

/** getCards **/
describe('getCards functionality', () => {
  test('getCard returns the card array that is set in the game state', () => {
    const game = initializeGameWithDeckSubsetAndNoShuffle();
    game.state.cards = game.state.deck; // set cards to the entire deck
    expect(game.getCards(game)).toEqual(game.state.deck); // expect getCards to return entire deck correspondingly
  });
});

/** getCard **/
describe('getCard functionality', () => {
  test('getCard returns the card that is set in the game state', () => {
    const game = initializeGameWithDeckSubsetAndNoShuffle();
    const randomCardFromDeck = game.state.deck[Math.floor(Math.random() * game.state.deck.length)];
    game.state.card = randomCardFromDeck; // set card to a random card in deck
    expect(game.getCard(game)).toEqual(randomCardFromDeck); // expect getCard to return same random card correspondingly
  });
});

/** guess21OrUnder **/
describe('guess21OrUnder functionality', () => {
  test('guess21OrUnder should draw the next card', () => {
    const game = initializeGameWithDeckSubsetAndNoShuffle();
    game.guess21OrUnder(game);
    expect(game.state.cards.length).toEqual(3);
    expect(game.state.cards[2]).toEqual('01D');
  });
  test('guess21OrUnder should set card value in game state to undefined', () => {
    const game = initializeGameWithDeckSubsetAndNoShuffle();
    game.guess21OrUnder(game);
    expect(game.state.card).toEqual(undefined);
  });
});

/** guessOver21 **/
describe('guessOver21 functionality', () => {
  test('guessOver21 should not add to the cards array', () => {
    const game = initializeGameWithDeckSubsetAndNoShuffle();
    const cardSize = game.state.cards.length;
    game.guessOver21(game);
    expect(game.state.cards.length).toEqual(cardSize);
  });
  test('guessOver21 should set card value in game state to the card drawn', () => {
    const game = initializeGameWithDeckSubsetAndNoShuffle();
    game.guessOver21(game);
    expect(game.state.card).toEqual('01D'); // O1D is the next card to be drawn given environment
  });
});