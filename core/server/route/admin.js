var express = require('express');
var admin = express();
var adminController = require('../controller/admin');

admin.route('*')
.get(adminController.getHomePage);

module.exports = admin;