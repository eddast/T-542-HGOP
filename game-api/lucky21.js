/****************************************************
 * IMPLEMENTS FUNCTIONALITY OF THE GAME LUCKY 21    *
 * Simple card game based on just these rules:      *
 * Guess either if card is 21 or less or over 21    *
 ****************************************************/

/**
 * The functionality of a lucky21 game
 * @param {string[]} deck represents the values of cards in a deck in the form of a string array
 * @param {*} dealer the functionality of a dealer: provides suffle and draw a card functionalities
 */
const lucky21Functionality = (deck, dealer) => {

    // Shuffle deck to randomize the deck array
    dealer.shuffle(deck);

    // Let dealer draw two cards initially
    let card0 = dealer.draw(deck);
    let card1 = dealer.draw(deck);

    // Set initial game state
    let state = {
        deck: deck,
        dealer: dealer,
        cards: [ card0, card1 ],
        card: undefined,
    };
    
    return {
        // Game state
        state: state,

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
            let drawnCard = dealer.draw(deck);
            game.state.cards.push(drawnCard);
            // TODO
        },
        // Player action (void).
        guessOver21: game => {
            // TODO
        },
    };
};

// Export the functionality of the lucky21 game
module.exports = lucky21Functionality;