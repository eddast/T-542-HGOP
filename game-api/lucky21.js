/********************
 * HELPER FUNCTIONS *
 ********************/
/**
 * Helper function to set and get initial game state
 * Game state has deck, drawn cards, current card and dealer
 * Shuffle deck and then draw two cards initially and place in drawn cards
 * @param {string[]} deck represents the values of cards in a deck in the form of a string array
 * @param {*} dealer the functionality of a dealer: provides suffle and draw a card functionalities
 * @return initial state for a lucky21 game
 */
const getInitialGameState = (dealer, deck) => {
    dealer.shuffle(deck);
    let card0 = dealer.draw(deck);
    let card1 = dealer.draw(deck);
    return {
        deck: deck,
        dealer: dealer,
        cards: [ card0, card1 ],
        card: undefined,
    };
}
/**
 * Helper function to determine if card is ace based on numeric value of card
 * @param {int} cardVal the numeric value of card (1-13)
 * @return {boolean} true if card is ace
 */
const cardIsAce = cardVal => cardVal === 1;
/**
 * Helper function to determine if card is Jack, Queen or King based on numeric value of card
 * @param {int} cardVal the numeric value of card (1-13)
 * @return {boolean} true if card is ace
 */
const cardIsRoyal = cardVal => cardVal > 10;


/*******************************
 * LUCKY 21 GAME FUNCTIONALITY *
 *******************************/
/**
 * The functionality of a lucky21 game
 * @param {string[]} deck represents cards in a deck in a string array
 * @param {*} dealer the functionality of a dealer: provides suffle and draw a card functionalities
 */
module.exports = (deck, dealer) => {
    return {
        /**
         * The game state object
         * Includes deck, dealer, cards array and card
         */
        state: getInitialGameState(dealer, deck),
        // Is the game over (true or false).
        isGameOver: game => {
            // TODO
        },
        // Has the player won (true or false).
        playerWon: game => {
            // TODO
        },
        // The highest score the cards can yield without going over 21 (integer).
        getCardsValue: game => {
            // TODO
        },
        // The value of the card that should exceed 21 if it exists (integer or undefined).
        getCardValue: game => {
            // TODO
        },
        getTotal: game => {
            // TODO
        },
        // The player's cards (array of strings).
        getCards: game => {
            // TODO
        },
        // The player's card (string or undefined).
        getCard: game => {
            // TODO
        },
        // Player action (void).
        guess21OrUnder: game => {
            // TODO
        },
        // Player action (void).
        guessOver21: game => {
            // TODO
        },
        
    };
};