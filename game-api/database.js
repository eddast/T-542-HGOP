/**
 * Maintains and fetches results in postgres database
 */
module.exports = function(context) {
    /**
     * Get postgres client and postgres config from context
     */
    const Client = context('pgClient');
    const configConstructor = context('config');
    const config = configConstructor(context);
    /**
     * Configure new postgres client
     */
    function getClient() {
        return new Client({
            host: config.pgHost,
            user: config.pgUser,
            password: config.pgPassword,
            database: config.pgDatabase,
        });
    }
    /**
     * Connect client to postgres
     * Creates game result table if client connects successfully to postgres
     */
    let client = getClient();
    setTimeout(() =>
        client.connect((err) => {
            if (err) console.log('failed to connect to postgres!');
            else console.log('successfully connected to postgres!');
    }), 2000);
    /**
     * Helper function: gets the count of rows with some condition from GameResult table
     * Then calls for success or error function with the row count
     * @param {string} byCondition the condition to apply to the count
     * @param {function} onSuccess function called on successful query to the postgres database
     * @param {function} onError function called on unsuccessful query to the postgres database
     */
    const getCountOfGameResult = (byCondition, onSuccess, onError) => {
        let client = getClient();
        client.connect((err) => {
            // Connection unsuccessful, call error function
            if (err) {
                onError(err);
                client.end();
            // Connection successful
            // Perform row count query with condition and call success function
            } else {
                const query = {
                    text: `SELECT COUNT(*) FROM "GameResult" ${ byCondition ? byCondition : '' };`
                };
                client.query(query, (err, res) => {
                    if (err)    onError();
                    else        onSuccess(res.rows[0].count);
                    client.end();
                });
            }
        });
        return;
    };
    
    return {
        /**
         * Inserts game result into postgres database
         * @param {boolean} won, true if game was won by user
         * @param {int} score user score in game
         * @param {int} total total score and the last card, i.e. the total when game terminated
         * @param {function} onSuccess function called on successful query to the postgres database
         * @param {function} onError function called on unsuccessful query to the postgres database
         */
        insertResult: (won, score, total, onSuccess, onError) => {
            let client = getClient();
            client.connect((err) => {
                if (err) {
                    onError(err);
                    client.end();
                } else {
                    const query = {
                        text: 'INSERT INTO "GameResult"("Won", "Score", "Total", "InsertDate") VALUES($1, $2, $3, CURRENT_TIMESTAMP);',
                        values: [won, score, total],
                    };
                    client.query(query, (err) => {
                        if (err)    onError();
                        else        onSuccess();
                        client.end();
                    });
                }
            });
            return;
        },

        /**
         * Gets the total number of games played
         * @param {function} onSuccess function called on successful query to the postgres database
         * @param {function} onError function called on unsuccessful query to the postgres database
         */
        getTotalNumberOfGames: (onSuccess, onError) =>
            getCountOfGameResult(null, onSuccess, onError),

        /**
         * Gets the total number of games won
         * @param {function} onSuccess function called on successful query to the postgres database
         * @param {function} onError function called on unsuccessful query to the postgres database
         */
        getTotalNumberOfWins: (onSuccess, onError) =>
            getCountOfGameResult('WHERE "Won"=true', onSuccess, onError),

        /**
         * Gets the total number of games won where the final score was 21
         * @param {function} onSuccess function called on successful query to the postgres database
         * @param {function} onError function called on unsuccessful query to the postgres database
         */
        getTotalNumberOf21: (onSuccess, onError) => 
            getCountOfGameResult('WHERE "Score"=21', onSuccess, onError),
    };
};