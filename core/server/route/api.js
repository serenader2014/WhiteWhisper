var express         = require('express');
var api             = express();
var apiController   = require('../controller/api');
var brute           = require('../middleware/brute');
var checkPermission = require('../middleware/check-permission');

api.route('/login')
    .post(brute({
        limitCount: 5,
        limitTime: 60*60*1000,
        minWaitTime: 100*1000,
    }), apiController.login);

api.route('/register')
    .post(apiController.register);

api.route('/logout')
    .all(apiController.logout);

api.route('/user')
    .get(function (req, res) {
        res.send(req.user);
    });

api.route('/post')
    .get(checkPermission('post', 'get'), apiController.post.list)
    .post(checkPermission('post', 'post'), apiController.post.create)
    .put(checkPermission('post', 'put'), apiController.post.update)
    .delete(checkPermission('post', 'delete'), apiController.post.delete);

api.route('/category')
    .get(checkPermission('category', 'get') ,apiController.category.list)
    .post(checkPermission('category', 'post'), apiController.category.create)
    .put(checkPermission('category', 'put'), apiController.category.update)
    .delete(checkPermission('category', 'delete'), apiController.category.delete);


module.exports = api;