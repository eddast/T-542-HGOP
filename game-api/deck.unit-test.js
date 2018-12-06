/**
 * Test deck class
 */
describe('deck functionality', () => {
    /**
     * Test if deck correctly returns a correct deck (in the sense of having 52 cards)
     */
    test('deck should yield 52 cards', () => {
        let deck = require('./deck.js');
        expect(deck().length).toEqual(52);
    });
});