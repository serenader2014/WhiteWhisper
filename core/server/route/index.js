var admin    = require('./admin');
var frontend = require('./frontend');
var api      = require('./api');
var express  = require('express');
var app      = express();


app.use('/api', api);
app.use('/admin', admin);
app.use('/', frontend);

module.exports = function () {
    return app;
};