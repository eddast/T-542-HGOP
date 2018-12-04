/**
  * Implements the functionality of a dealer
  * Provides two functionalities:
  *     Shuffling the game deck
  *     Drawing card from game deck
  * @return object containing shuffle and draw functions
  */
 module.exports = () => {
    return {
        /**
         * Shuffles the given deck
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