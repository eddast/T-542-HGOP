const deckConstructor = require('./deck.js');
const dealerConstructor = require('./dealer.js');
const lucky21Constructor = require('./lucky21.js');

test('guess21OrUnder should draw the next card', () => {
  // Arrange
  let deck = deckConstructor();
  let dealer = dealerConstructor();
  deck = [ '10H', '09S', '01D', '05L', ];

  // Override the shuffle to do nothing.
  dealer.shuffle = (deck) => {};
  
  // Inject our dependencies
  let game = lucky21Constructor(deck, dealer);
  
  // Act
  game.guess21OrUnder(game, dealer);
  
  // Assert
  expect(game.cards.length).toEqual(3);
  expect(game.cards[2]).toEqual('01D');
});

// TODO: At least 20 unit tests