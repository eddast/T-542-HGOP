let randomConstructor = require('./random.js');

/**
 * Tests random functionality along with it's function randomInt
 */
describe('random functionality', () => {
    /**
     * Check if randomInt correctly respects it's range given (min and max)
     */
    test('randomInt function yields a number within the range of min and max (included)', () => {
        const { randomInt } = randomConstructor();
        const min = 10, max = 100;
        expect(randomInt(min, max)).toBeLessThanOrEqual(max);
        expect(randomInt(min, max)).toBeGreaterThanOrEqual(min);
    });
    /**
     * Check if randomInt inevitably yields a single number given a single number range
     */
    test('randomInt function with min 0 and max 0 inevitably yields 0', () => {
        const { randomInt } = randomConstructor();
        expect(randomInt(0, 0)).toEqual(0);
    });
    /**
     * Check if randomInt of small range yields only numbers within that small range
     */
    test('randomInt function of small range yields one of those numbers within the range', () => {
        const { randomInt } = randomConstructor();
        const min = 99, max = 100;
        const resOfRandomInt = randomInt(min, max);
        expect(resOfRandomInt === 99 || resOfRandomInt === 100).toEqual(true);
    });
});