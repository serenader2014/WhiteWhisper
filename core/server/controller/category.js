var categoryApi = require('../api').category;
var log         = require('../helper/log');
module.exports = {
    list: function (req, res) {
        var page = req.query.page || 1;
        var amount = req.query.amount || 20;
        categoryApi.get({}, amount, page).then(function (data) {
            res.json({code: 0, data: data});
        }).catch(function (err) {
            res.json({code: -1, err: err});
            log.error(err);
        });
    }
};