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
};
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
module.exports = (context) => {
    /**
     * Get deck and dealer from context file
     */
    let deckConstructor = context('deck');
    let deck = deckConstructor(context);
    let dealerConstructor = context('dealer');
    let dealer = dealerConstructor(context);

    return {
        /**
         * The game state object
         * Includes deck, dealer, cards array and card
         */
        state: getInitialGameState(dealer, deck),
        /**
         * Checks if game is ongoing. It's ongoing if player has won or lost.
         * Player has lost under two circumstances:
         *  Player just guessed 21 or under and total went over 21
         *  Player just guessed over 21 and total went to 21 or under
         * @param game the game along with game state
         * @return {boolean} true if player has lost the game, false otherwise
         */
        isGameOver: game => {
            return (
                // Game is over if player won
                (game.playerWon(game)) ||
                // If card is undefined player just guessed 21 or under
                (game.state.card === undefined && game.getTotal(game) > 21) ||
                // If card is not undefined player just guessed over 21
                (game.state.card !== undefined && game.getTotal(game) <= 21)
            );
        },
        /**
         * Checks if player won game. Player has won under two circumstances:
         *  Player just guessed 21 or under and total went up to 21
         *  Player just guessed over 21 and total went over 21
         * @param game the game along with game state
         * @return {boolean} true if player has won the game, false otherwise
         */
        playerWon: game => {
            return (
                // If card is undefined player just guessed 21 or under
                (game.state.card === undefined && game.getTotal(game) === 21) ||
                // If card is not undefined player just guessed over 21
                (game.state.card !== undefined && game.getTotal(game) > 21)
            );
        },
        /**
         * Gets the value of cards currently drawn by user
         * Determines aces either as 11 or 1 s.t. total cards value does not exceed 21
         * @param game the game along with game state
         * @return {int} sum of the value of all cards in cards array
         */
        getCardsValue: game => {
            let cards = game.state.cards.slice();
            // Sort in reverse such that aces appear last in cards array
            // Necessary to determine whether to calculate them as 1 or 11
            cards = cards.sort().reverse();
            let cardsValue = 0;
            for( let i = 0; i < cards.length; i++ ) {
                const card = cards[i];
                let cardVal = parseInt(card.substring(0,2));
                // Determine whether ace goes over 21 as 11
                // If so set to 11, otherwise it takes the value of 1
                if (cardIsAce(cardVal)) {
                    if(cardsValue + 11 <= 21) cardVal = 11;
                    else cardVal = 1;
                }
                // Jack, Queen and King have value of 10
                else if (cardIsRoyal(cardVal)) cardVal = 10;
                cardsValue += cardVal;
            }
            return cardsValue;
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
        /**
         * Calculates total value for all cards in deck as well as guessed card over 21 (if it exists)
         * @param game the game along with game state
         * @return {int} total value for all cards in deck as well as guessed card over 21 (if it exists)
         */
        getTotal: game => {
            if ( game.getCardValue(game) === undefined) return game.getCardsValue(game);
            return game.getCardsValue(game) + game.getCardValue(game);
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
            const nextCard = dealer.draw(game.state.deck);
            game.state.card = undefined;
            game.state.cards.push(nextCard);
        },
        /**
         * Player guesses 21 or over
         * Then we use the card value as indication player guessed over 21
         * @param game the game along with game state
         */
        guessOver21: game => {
            const nextCard = dealer.draw(game.state.deck);
            game.state.card = nextCard;
        },
        /**
         * Returns the state of the game
         */
        getState: game => {
            return {
                cards: game.state.cards,
                card: game.state.card
            };
        }
    };
};