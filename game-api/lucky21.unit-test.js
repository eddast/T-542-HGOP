/********************************************
 * UNIT TESTS FUNCTIONALITY OF LUCKY21 GAME *
 ********************************************/

const deckConstructor = require('./deck.js');
const dealerConstructor = require('./dealer.js');
const lucky21Constructor = require('./lucky21.js');

/***********************
 * TEST INITIALIZATION *
 ***********************/
test('a new game should have 50 cards left in the deck', () => {
  let deck = deckConstructor();
  let dealer = dealerConstructor();
  let gameState = lucky21Constructor(deck, dealer).state;
  expect(gameState.deck.length).toEqual(50);
});
test('a new game should have 2 drawn cards', () => {
  let deck = deckConstructor();
  let dealer = dealerConstructor();
  let gameState = lucky21Constructor(deck, dealer).state;
  expect(gameState.cards.length).toEqual(2);
});

/**********************
 * TEST FUNCTIONALITY *
 **********************/
test('guess21OrUnder should draw the next card', () => {

  // Arrange
  let deck = deckConstructor();
  let dealer = dealerConstructor();
  deck = ['05L', '01D', '09S', '10H'];
  dealer.shuffle = deck => { /* Override the shuffle to do nothing */ };
  let game = lucky21Constructor(deck, dealer);
  
  // Act
  game.guess21OrUnder(game);
  
  // Assert
  expect(game.state.cards.length).toEqual(3);
  expect(game.state.cards[2]).toEqual('01D');
});

// TODO: At least 20 unit tests