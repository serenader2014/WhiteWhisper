var categoryApi    = require('../api').category;
var log            = require('../helper/log');
var checkBodyError = require('../middleware/check-body-error');
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
    },
    create: function (req, res) {
        var name = req.body.name;

        req.checkBody('name', '分类名为空。')
            .notEmpty();

        if (checkBodyError(req, res)) { return; }

        categoryApi.getByName(name).then(function (data) {
            if (data.total) {
                throw {
                    message: '分类名称已存在。',
                    code: -5
                };
            }
            return categoryApi.create({name: name});
        }).then(function (category) {
            res.json({code: 0, data: category});
        }).catch(function (err) {
            res.json({code: err.code || 1, error: err.message});
            log.error(err);
        });
    },
    update: function () {

    },
    delete: function () {

    }
};