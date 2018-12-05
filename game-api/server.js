/**
 * Functionality of the API
 */
module.exports = (context) => {

    const express = context('express');
    const database = context('database');
    const { port } = context('config');
    let app = express();

    app.get('/status', (req, res) => {
        res.statusCode = 200;
        res.send('The API is running!\n');
    });

    // api call to /items which returns a list of the the 10 newest item names.
    app.get('/items', (req, res) => {
        database.getItems(function (items){
            var names = items.map(x => x.name);
            res.statusCode = 200;
            res.send(names);
        });
    });

    // api call to /items/name which inserts an item to database.
    app.post('/items/:name', (req, res) => {
        var name = req.params.name;
        database.insertItem(name, new Date(), function() {
            var msg = 'item inserted successfully';
            res.statusCode = 201;
            res.send(msg);
        });
    });

    return {
        listen = () => app.listen(port)
    }
}