# T-542-HGOP: Day Eleven

## 1. **Q:** Consider below code from server.js. Explain why we put each consecutive call inside the onSuccess callback of the previous database call, instead of just placing them next to each other:
(Snip from server.js):
```javascript
app.post('/stats', (req, res) => {
    database.getTotalNumberOfGames((totalNumberOfGames) => {
        database.getTotalNumberOfWins((totalNumberOfWins) => {
            database.getTotalNumberOf21((totalNumberOf21) => {
                res.statusCode = 200;
                res.send({
                    totalNumberOfGames: totalNumberOfGames,
                    totalNumberOfWins: totalNumberOfWins,
                    totalNumberOf21: totalNumberOf21,
                });
        /* snipped */
```

**A:** This is done because each of the three functions that call to database, e.g. getTotalNumberOfGames() function, getTotalNumberOfWins() function and getTotalNumberOf21() are asynchronous and the only way to know that results have **successfully** been retrieved from their call is when they call onSuccess callback function that is passed in as their parameter. Note that each of the three asynchronous functions must succeed for the overall request to [POST] /stats to return 200 (OK) and in order for us to have all appropriate information at hand to send a successful HTTP response back with correct data. Therefore since the three calls are asynchronous, we put the next call in the onSuccess callback as that way we've asserted that the previous call has returned results successfully, and so on until we have all the information we need to send response back.