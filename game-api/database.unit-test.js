const inject = require('./inject.js');
const databaseConstructor = require('./database.js');
/**
 * Dummy object for parameter list filling
 */
const baseConfig = {
    config: (context) => {
        return {
            pgHost: 'localhost',
            pgUser: 'test',
            pgPassword: 'testing',
            pgDatabase: 'game'
        };
    }
};
/**
 * Tests suite for getCountOfGameResult function suite
 */
describe('getCountOfGameResult functionality', () => {
    /**
     * Test if error callback functions as expected
     * Whenn client cannot connect
     */
    test('Callbacks error when the client is unable to connect with getTotalNumberOfGames', () => {
        const newConfig = {
            pgClient: function() {
                return {
                    connect: (cb) => cb(true),
                    query: (str, cb) => { cb(false, {}); },
                    end: () => {},
                };
            },
            config: baseConfig.config
        };
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.getTotalNumberOfGames(successMock, failureMock);
        expect(failureMock).toHaveBeenCalledWith(true);
    });
    /**
     * Test if method of getting total played games returns correct result
     * given one played game and a successful connection to client
     */
    test('Callbacks with count 1 when the client is able to query with getTotalNumberOfGames', () => {
        const newConfig = {
            pgClient: function() {
                return {
                    connect: (cb) => cb(false),
                    query: (str, cb) => { cb(false, { rows: [{ count: 1 }] }); },
                    end: () => {},
                };
            },
            config: baseConfig.config,
        };
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.getTotalNumberOfGames(successMock, failureMock);
        expect(successMock).toHaveBeenCalledWith(1);
    });
    /**
     * Test if method of getting total won games returns correct result
     * given two won games and a successful connection to client
     */
    test('Callbacks with count 2 when the client is able to query with getTotalNumberOfWins', () => {
        const newConfig = {
            pgClient: function() {
                return {
                    connect: (cb) => cb(false),
                    query: (str, cb) => { cb(false, { rows: [{ count: 2 }] }); },
                    end: () => {},
                };
            },
            config: baseConfig.config
        };
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.getTotalNumberOfWins(successMock, failureMock);
        expect(successMock).toHaveBeenCalledWith(2);
    });
    /**
     * Test if method of getting total games with total of 21 returns correct result
     * given one such game and a successful connection to client
     */
    test('Callbacks with count 1 when the client is able to query with getTotalNumberOf21', () => {
        const newConfig = { 
            pgClient: function() {
                return {
                    connect: (cb) => cb(false),
                    query: (str, cb) => { cb(false, { rows: [{ count: 1 }] }); },
                    end: () => {},
                };
            },
            config: baseConfig.config
        };
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.getTotalNumberOf21(successMock, failureMock);
        expect(successMock).toHaveBeenCalledWith(1);
    });
    /**
     * Test if method of getting total games with total of 21 correctly calls error callback
     * given unsuccessful connection to client
     */
    test('Callbacks with error when the query responds with an error with getTotalNumberOf21', () => {
        const newConfig = { 
            pgClient: function() {
                return {
                    connect: (cb) => cb(false),
                    query: (str, cb) => { cb(true, { }); },
                    end: () => {},
                };
            },
            config: baseConfig.config,
        };
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.getTotalNumberOf21(successMock, failureMock);
        expect(failureMock).toHaveBeenCalled();
    });
});
/**
 * Tests suite for insertResult function
 */
describe('insertResult processes correctly', () => {
    /**
     * Test if method correctly calls error callback
     * given unsuccessful connection to client
     */
    test('Callbacks with error when the connect responds with an error with insertResult', () => {
        const newConfig = { 
            pgClient: function() {
                return {
                    connect: (cb) => cb(true),
                    query: (str, cb) => { cb(false, { }); },
                    end: () => {},
                };
            },
            config: baseConfig.config
        };
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.insertResult(true, 21, 21, successMock, failureMock);
        expect(failureMock).toHaveBeenCalled();
    });
    /**
     * Test if method correctly calls error callback
     * given unsuccessful query to the database
     */
    test('Callbacks with error when the query responds with an error with insertResult', () => {
        const newConfig = { 
            pgClient: function() {
                return {
                    connect: (cb) => cb(false),
                    query: (str, cb) => { cb(true, { }); },
                    end: () => {},
                };
            },
            config: baseConfig.config
        };
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.insertResult(true, 21, 21, successMock, failureMock);
        expect(failureMock).toHaveBeenCalled();
    });
    /**
     * Test if method correctly calls onSuccess function
     * If all executes correctly
     */
    test('Callbacks with success when the query responds with no error with insertResult', () => {
        const newConfig = {
            pgClient: function() {
                return {
                    connect: (cb) => cb(false),
                    query: (str, cb) => { cb(false, { }); },
                    end: () => {},
                };
            },
            config: baseConfig.config
        };
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.insertResult(true, 21, 21, successMock, failureMock);
        expect(successMock).toHaveBeenCalled();
    });
});