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
        /**
         * Gets value from the game state's card
         * RULE #1: Card does not exist (undefined), e.g. user guessed 21 or under, return undefined
         * RULE #2: If card value is J, Q or K the card value is 10
         * RULE #3: If card value is ace, we want it to be favorable to user
         *          Which has guessed card to yield total over 21 so 11 is returned
         * RULE #4: Any other card corresponds to it's numeric value (2-10)
         * @param game the game along with game state
         * @return {int|undefined} value for card variable of the game state
         */
        getCardValue: game => {
            const { card } = game.state;
            if (card === undefined) return card;
            // Extract value of card (1-13)
            const cardValue = parseInt(card.substring(0,2));
            if (cardIsRoyal(cardValue)) return 10; 
            if (cardIsAce(cardValue))   return 11;
            return cardValue;
        },
        getTotal: game => {
            // TODO
        },
        /**
         * Gets player's cards that have been drawn in game
         * @param game the game along with game state
         * @returns {string[]} array corresponding to drawn cards in game
         */
        getCards: game => game.state.cards,
        /**
         * Gets player's current card just drawn
         * @param game the game along with game state
         * @returns {string} value corresponding to card in card deck
         */
        getCard: game => game.state.card,
        /**
         * Player guesses 21 or under
         * Then we add to card array
         * Set card value to undefined as indication player guessed 21 or under
         * @param game the game along with game state
         */
        guess21OrUnder: game => {
            const nextCard = dealer.draw(deck);
            game.state.card = undefined;
            game.state.cards.push(nextCard);
        },
        /**
         * Player guesses 21 or over
         * Then we use the card value as indication player guessed over 21
         * @param game the game along with game state
         */
        guessOver21: game => {
            const nextCard = dealer.draw(deck);
            game.state.card = nextCard;
        },
        
    };
};