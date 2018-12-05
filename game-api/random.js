/**
 * Has functionality to return a random integer from some range
 */
module.exports = function(context) {
    return {
        randomInt(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        },
    };
};