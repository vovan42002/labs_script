const express = require('express');
const config = require('./config.js');
const client = require('./client.js');
const app = express();

app.use("/", function (request, response, next) {
    client.get_data(config.get('url'))
        .then(result => {
            response.send(result);
        });
});

module.exports = app;