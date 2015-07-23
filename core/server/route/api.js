var express = require('express');
var router  = express.Router();
var apiController = require('../controller/api');
var brute = require('../middleware/brute');

router.post('/login', brute({
    limitCount: 5,
    limitTime: 60*60*1000,
    minWaitTime: 100*1000,
}), apiController.login);

module.exports = router;