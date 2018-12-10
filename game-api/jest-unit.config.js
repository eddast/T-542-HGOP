module.exports = {
    verbose: true,
    testPathIgnorePatterns: [ "<rootDir>/node_modules/" ],
    testMatch: [ "<rootDir>/*.unit-test.js" ],
    collectCoverageFrom: [
        "*.js",
        "!*-test.js",
        "!*config.js"
    ]
};