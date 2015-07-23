var express = require('express');
var adminController = require('../controller/admin');

module.exports = function () {
    var router = express.Router();

    router.get('*', adminController);

    return router;
};