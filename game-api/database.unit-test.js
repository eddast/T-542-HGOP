const inject = require('./inject.js');
const databaseConstructor = require('./database.js');

const baseConfig = {
    pgClient: function(config) {
        return {
            connect: (cb) => cb(false),
            query: (str, cb) => { cb(false, {})},
            end: () => {},
        }
    },
    config: (context) => {
        return {
            pgHost: 'localhost',
            pgUser: 'test',
            pgPassword: 'testing',
            pgDatabase: 'game'
        }
    }
}

describe('getCountOfGameResult functionality', () => {
    test('Callbacks error when the client is unable to connect with getTotalNumberOfGames', () => {
        const newConfig = { ...baseConfig };
        newConfig.pgClient = function() {
            return {
                connect: (cb) => cb(true),
                query: (str, cb) => { cb(false, {})},
                end: () => {},
            }
        }
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.getTotalNumberOfGames(successMock, failureMock);
        expect(failureMock).toHaveBeenCalledWith(true);
    });

    test('Callbacks with count 1 when the client is able to query with getTotalNumberOfGames', () => {
        const newConfig = { ...baseConfig };
        newConfig.pgClient = function() {
            return {
                connect: (cb) => cb(false),
                query: (str, cb) => { cb(false, { rows: [{ count: 1 }] }) },
                end: () => {},
            }
        }
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.getTotalNumberOfGames(successMock, failureMock);
        expect(successMock).toHaveBeenCalledWith(1);
    });

    test('Callbacks with count 2 when the client is able to query with getTotalNumberOfWins', () => {
        const newConfig = { ...baseConfig };
        newConfig.pgClient = function() {
            return {
                connect: (cb) => cb(false),
                query: (str, cb) => { cb(false, { rows: [{ count: 2 }] }) },
                end: () => {},
            }
        }
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.getTotalNumberOfWins(successMock, failureMock);
        expect(successMock).toHaveBeenCalledWith(2);
    });

    test('Callbacks with count 1 when the client is able to query with getTotalNumberOf21', () => {
        const newConfig = { ...baseConfig };
        newConfig.pgClient = function() {
            return {
                connect: (cb) => cb(false),
                query: (str, cb) => { cb(false, { rows: [{ count: 1 }] }) },
                end: () => {},
            }
        }
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.getTotalNumberOf21(successMock, failureMock);
        expect(successMock).toHaveBeenCalledWith(1);
    });

    test('Callbacks with error when the query responds with an error with getTotalNumberOf21', () => {
        const newConfig = { ...baseConfig };
        newConfig.pgClient = function() {
            return {
                connect: (cb) => cb(false),
                query: (str, cb) => { cb(true, { }) },
                end: () => {},
            }
        }
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.getTotalNumberOf21(successMock, failureMock);
        expect(failureMock).toHaveBeenCalled();
    });
});

describe('insertResult processes correctly', () => {
    
    test('Callbacks with error when the connect responds with an error with insertResult', () => {
        const newConfig = { ...baseConfig };
        newConfig.pgClient = function() {
            return {
                connect: (cb) => cb(true),
                query: (str, cb) => { cb(false, { }) },
                end: () => {},
            }
        }
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.insertResult(true, 21, 21, successMock, failureMock);
        expect(failureMock).toHaveBeenCalled();
    });

    test('Callbacks with error when the query responds with an error with insertResult', () => {
        const newConfig = { ...baseConfig };
        newConfig.pgClient = function() {
            return {
                connect: (cb) => cb(false),
                query: (str, cb) => { cb(true, { }) },
                end: () => {},
            }
        }
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.insertResult(true, 21, 21, successMock, failureMock);
        expect(failureMock).toHaveBeenCalled();
    });

    test('Callbacks with success when the query responds with no error with insertResult', () => {
        const newConfig = { ...baseConfig };
        newConfig.pgClient = function() {
            return {
                connect: (cb) => cb(false),
                query: (str, cb) => { cb(false, { }) },
                end: () => {},
            }
        }
        const successMock = jest.fn();
        const failureMock = jest.fn();
        const database = databaseConstructor(inject(newConfig));

        database.insertResult(true, 21, 21, successMock, failureMock);
        expect(successMock).toHaveBeenCalled();
    });
});