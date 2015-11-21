var express = require('express');
var frontend = express();
var homePageController = require('../controller/frontend');

frontend.route('/')
.get(homePageController.getHomePage);

module.exports = frontend;