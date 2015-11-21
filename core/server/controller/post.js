var postApi = require('../api').post;
var list = function (req, res) {
    var page = req.query.page || 1;
    var amount = req.query.amount || 20;
    postApi.get({}, amount, page).then(function (data) {
        res.json(data);
    });
};

var update = function () {

};

var create = function (req, res) {
    var title = req.body.title;
    res.json({code: 0});
};

var del = function () {

};

module.exports.list   = list;
module.exports.update = update;
module.exports.create = create;
module.exports.delete = del;