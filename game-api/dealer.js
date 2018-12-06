/**
  * Implements the functionality of a dealer
  * Provides two functionalities:
  *     Shuffling the game deck
  *     Drawing card from game deck
  * @return object containing shuffle and draw functions
  */
 module.exports = (context) => {
    return {
        /**
         * Shuffles the given deck
         * @param {string[]} deck to shuffle
         */
        shuffle: deck => {
            const random = context('random'); // provides functionality to get random integer
            for (let i = 0; i < deck.length - 1; i++) {
                const j = random.randomInt(i, deck.length);
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