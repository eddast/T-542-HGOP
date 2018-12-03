/**
  * Implements the functionality of a dealer
  * Provides two functionalities:
  *     Shuffling the game deck
  *     Drawing card from game deck
  * @return object containing shuffle and draw functions
  */
 const dealerFunctionality = () => {
    return {
        /**
         * Shuffles deck
         * @param {string[]} deck to shuffle
         */
        shuffle: deck => {
            for (let i = 0; i < deck.length - 1; i++) {
                const j = Math.floor(Math.random() * (deck.length - i)) + i;
                const card = deck[j];
                const old = deck[i];
                deck[i] = card;
                deck[j] = old;
            }
        },
        /**
         * Draws card from deck
         * @param {string[]} deck to draw a card from
         */
        draw: deck => deck.pop(),
    };
};

// Export the functionality of the lucky21 game
module.exports = dealerFunctionality;