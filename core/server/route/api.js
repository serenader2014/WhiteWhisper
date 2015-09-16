var express = require('express');
var api = express();
var apiController = require('../controller/api');
var brute = require('../middleware/brute');

api.route('/login')
    .post(brute({
        limitCount: 5,
        limitTime: 60*60*1000,
        minWaitTime: 100*1000,
    }), apiController.login);

api.route('/register')
    .post(apiController.register);

api.route('/logout')
    .get(apiController.logout);

api.route('/user')
    .get(function (req, res) {
        res.send(req.user);
    });

module.exports = api;