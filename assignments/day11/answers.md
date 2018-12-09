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

## 2. **Q:** Consider below code snippet from server.api-test.js. What does the done parameter do?
(Snip from server.api-test.js):
```javascript
test('play a game', (done) =>
    helper.playGame(process.env.API_URL, done),
timeout);
```

**A:** Essentially done has the functionality callback function to notify the Jest framework of when test is done executing. The done parameter is used to signal that test is done both if test executes successfully or if test fails, but is used differently in case of fail or success to explicitly signal whether test was successful, e.g: 
```javascript
done();             // explicitly signals test executed successfully
done.fail(error);   // explicitly signals that test has failed
```
This explicitly signals to Jest that test has run and notifies jest of it's result. In the code snippet above, timeout is set as an additional parameter to the test function, and therefore when test times out and "done" paramter has not been used to signal test termination, test explicitly times out.
