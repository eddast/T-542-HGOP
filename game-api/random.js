/**
 * Has functionality to return a random integer from some range
 */
module.exports = function() {
    return {
        randomInt: (min, max) => Math.floor(Math.random() * (max - min) + min),
    };
};