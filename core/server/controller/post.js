var _           = require('lodash');
var htmlToText  = require('html-to-text');
var postApi     = require('../api').post;
var categoryApi = require('../api').category;
var log         = require('../helper/log');
var checkBodyError   = require('../middleware/check-body-error');

var list        = function (req, res) {
    var page   = req.query.page || 1;
    var amount = req.query.amount || 20;
    postApi.get({status: 'published'}, amount, page).then(function (data) {
        res.json(data);
    });
};

var update = function (req, res) {
    var id       = req.body.id;
    var title    = req.body.title;
    var author   = req.user;
    var slug     = req.body.slug;
    var markdown = req.body.markdown;
    var html     = req.body.html;
    var tags     = req.body.tags;
    var status   = req.body.status;
    var category = req.body.category;

    req.checkBody('id', '文章ID为空')
        .notEmpty();
    req.checkBody('title', '文章标题为空。')
        .notEmpty();
    req.checkBody('category', '文章分类为空。')
        .notEmpty();
    req.checkBody('status', '文章状态有误。')
        .isPostStatus();

    if (checkBodyError(req, res)) { return; }
    
    categoryApi.getById(category).then(function (data) {
        if (!data.total) {
            throw {code: -5, message: '找不到该文章分类。'};
        }
        return data.data[0];
    }).then(function (category) {
        postApi.getById(id).then(function (data) {
            if (!data.total) {
                res.json({code: -5, msg: '找不到该文章。'});
                return;
            }
            var post = data.data[0];
            var draft = post.draft;
            if (['published', 'unpublished'].indexOf(status) !== -1) {
                draft.push(_.pick(post, [
                    'title', 
                    'slug', 
                    'create',
                    'markdown', 
                    'html', 
                    'tags', 
                    'status', 
                    'category',
                    'excerpt']));
                return postApi.update(id, {
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
                    draft: draft
                });
            } else {
                draft.push({
                    title   : title,
                    create  : new Date(),
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
                return postApi.update(id, {
                    draft: draft
                });
            }
        }).then(function (post) {
            res.json({code: 0, data: post});
        }).catch(function (err) {
            res.json({code: err.code || 1, error: err.message});
            log.error(err);
        });
    });
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

    req.checkBody('title', '文章标题为空。')
        .notEmpty();
    req.checkBody('category', '文章分类为空。')
        .notEmpty();
    req.checkBody('status', '文章状态有误。')
        .isPostStatus();

    if (checkBodyError(req, res)) { return; }
    
    categoryApi.getById(category).then(function (data) {
        if (!data.total) {
            throw ({code: -5, message: '找不到该文章分类。'});
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
        res.json({code: err.code || 1, error: err.message});
        log.error(err);
    });
};

var del = function (req, res) {
    var id = req.body.id;

    req.checkBody('id', '文章ID为空。')
        .notEmpty();

    if (checkBodyError(req, res)) { return; }

    postApi.getById(id).then(function (data) {
        if (!data.total) { throw {code: -4, message: '文章不存在。'}; }
        return postApi.delete(id);
    }).then(function () {
        res.json({code: 0});
    }).catch(function (err) {
        res.json({code: err.code || 1, error: err.message});
        log.error(err);
    });

};

module.exports.list   = list;
module.exports.update = update;
module.exports.create = create;
module.exports.delete = del;