var htmlToText  = require('html-to-text');
var postApi     = require('../api').post;
var categoryApi = require('../api').category;
var log         = require('../helper/log');

var list        = function (req, res) {
    var page   = req.query.page || 1;
    var amount = req.query.amount || 20;
    postApi.get({}, amount, page).then(function (data) {
        res.json(data);
    });
};

var update = function () {

};

var create = function (req, res) {
    var title    = req.body.title;
    var author   = req.user;
    var slug     = req.body.slug;
    var markdown = req.body.markdown;
    var html     = req.body.html;
    var tags     = req.body.tags;
    var status   = req.body.status;
    var category = req.body.category;
    var errors;

    req.checkBody('title', '文章标题为空。')
        .notEmpty();
    req.checkBody('slug', '文章Slug为空。')
        .notEmpty();
    req.checkBody('category', '文章分类为空。')
        .notEmpty();

    errors = req.validationErrors();
    if (errors) {
        res.json({code: -3, msg: '表单数据有误。', data: errors});
        return;
    }
    categoryApi.getById(category).then(function (data) {
        if (!data.total) {
            res.json({code: -5, msg: '找不到该文章分类。'});
            return;
        }
        var category = data.data[0];
        return postApi.create({
            title : title,
            create: new Date(),
            author: {
                username: author.username,
                id      : author._id,
                avatar  : author.avatar
            },
            slug    : slug,
            markdown: markdown,
            html    : html,
            tags    : (tags || '').split(','),
            status  : status,
            category: {
                name: category.name,
                id  : category._id
            },
            excerpt : htmlToText.fromString(html).substring(0, 350),
        });
    }).then(function (post) {
        res.json({code: 0, data: post});
    }).catch(function (err) {
        res.json({code: 1, msg: err.message});
        log.error(err);
    });
};

var del = function () {

};

module.exports.list   = list;
module.exports.update = update;
module.exports.create = create;
module.exports.delete = del;