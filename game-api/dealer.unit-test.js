/**
 * Alter random int function for specific testing purpose for dealer
 * @param {number[]} randomReturnValues values to use to shuffle
 */
function newRandom(randomReturnValues) {
    let i = 0;
    return {
        randomInt: (min, max) => {
            return randomReturnValues[i++];
        }
    };
}
/**
 * Test if dealer shuffles based on dependencies given
 * e.g. the random dependency provided
 */
describe('dealer shuffle functionality', () => {
    /**
     * Test if dealer shuffles cards based on known non-random shuffle
     * (e.g. uses newRandom as dependency)
     */
    test('dealer should should shuffle cards', () => {
        let dependencies = { 'random': newRandom([2, 1]) };
        let newDealer = require('./dealer.js');
        let dealer = newDealer((name) => dependencies[name]);
        let deck = ['a', 'b', 'c'];
        dealer.shuffle(deck);
        expect(deck).toEqual(['c', 'b', 'a']);
    });
    /**
     * Test if dealer shuffles cards based differently based on different known non-random shuffle algorithm
     * (e.g. uses newRandom as dependency)
     */
    test('dealer should should shuffle cards differently given different (but idempotent) random algorithms', () => {
        let dependencies01 = { 'random': newRandom([2, 1]) };
        let dependencies02 = { 'random': newRandom([2, 0, 1]) };
        let dealerConstructor = require('./dealer.js');
        let dealer01 = dealerConstructor((name) => dependencies01[name]);
        let dealer02 = dealerConstructor((name) => dependencies02[name]);
        let deck01 = ['a', 'b', 'c'];
        let deck02 = ['a', 'b', 'c'];
        dealer01.shuffle(deck01);
        dealer02.shuffle(deck02);
        expect(deck01).not.toEqual(deck02);
    });
    /**
     * Test if dealer returns empty deck if an empty deck is shuffled
     */
    test('shuffle yields empty deck on shuffle when initial deck is empty', () => {
        let dependencies = { 'random': { randomInt: () => 0 }};
        let newDealer = require('./dealer.js');
        let dealer = newDealer((name) => dependencies[name]);
        let deck = [ ];
        dealer.shuffle(deck);
        expect(deck).toEqual([ ]);
    });
});

describe('dealer draw functionality', () => {
    /**
     * Check if draw function correctly returns last element in deck array
     */
    test('dealer draw should return last element in deck array', () => {
        let deck = ['a', 'b', 'c'];
        let newDealer = require('./dealer.js');
        let dealer = newDealer( /*context/dependencies not required*/ );
        expect(dealer.draw(deck)).toEqual('c');
    });
    /**
     * Check if empty deck returns undefined when dealer attempts to draw
     */
    test('dealer draw should return undefined when attempting to draw from empty deck', () => {
        let deck = [];
        let newDealer = require('./dealer.js');
        let dealer = newDealer( /*context/dependencies not required*/ );
        expect(dealer.draw(deck)).toEqual(undefined);
    });
});
