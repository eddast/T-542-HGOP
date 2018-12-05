// export available database functions.
module.exports = (context) => {

    const Client = context('pgClient');
    const config = context('config');

    function getClient() {
        return new Client({
            host: config.pgHost,
            user: config.pgUser,
            password: config.pgPassword,
            database: config.pgDatabase
        });
    }

    var client = getClient();
    // NOTE: I was having problems with concurrency, apparently "depends_on" in docker-compose did not always function as should
    // Added the following time out function as workaround to wait for postgres to start before client connects
    // Consulted this with lab instructor, he said this was OK and he said to keep the time out function here as is
    setTimeout(() =>
        client.connect((err) => {
            if (err) console.log('failed to connect to postgres!');
            else {
                console.log('successfully connected to postgres!');
                client.query('CREATE TABLE IF NOT EXISTS Item (ID SERIAL PRIMARY KEY, Name VARCHAR(32) NOT NULL, InsertDate TIMESTAMP NOT NULL);', (err) => {
                    if (err) console.log('error creating Item table!');
                    else console.log('successfully created item table!');
                    client.end();
                });
            }
        }),
    2000);

    /**
     * Returns object with insertItem and getItems functionalities
     */
    return {
        insertItem: (name, insertDate, onInsert) => {
            var client = getClient();
            client.connect(() => {
                const query = {
                    text: 'INSERT INTO Item(Name, InsertDate) VALUES($1, $2);',
                    values: [name, insertDate],
                };
                client.query(query, (err, res) => {
                    onInsert();
                    client.end();
                });
            });
            return;
        },
        getItems: onGet => {
            var client = getClient();
            client.connect(() => {
                const query = {
                    text: 'SELECT ID, Name, InsertDate FROM Item ORDER BY InsertDate DESC LIMIT 10;',
                    rowMode: 'array'
                };
                client.query(query, (err, res) => {
                    onGet(res.rows.map(row => {
                        return {
                            id: row[0],
                            name: row[1],
                            insertdate: row[2]
                        };
                    }));
                    client.end();
                });
            });
            return;
        }
    }
};
