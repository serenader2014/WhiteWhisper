import _              from 'lodash';
import htmlToText     from 'html-to-text';
import postApi        from '../api/post';
import categoryApi    from '../api/category';
import log            from '../helper/log';
import checkBodyError from '../middleware/check-body-error';

const list           = (req, res) => {
    let page      = req.query.page || 1;
    let amount    = req.query.amount || 20;
    let author    = req.query.author;
    let status    = req.query.status;
    let type      = req.query.type;
    let startTime = new Date(+req.query.startTime || req.query.startTime);
    let endTime   = new Date(+req.query.endTime || req.query.endTime);
    let search    = req.query.search ? new RegExp(req.query.search, 'ig') : null;
    let category  = req.query.category;
    let dateQuery = {};
    let id        = req.query.id;
    let direction = +req.query.direction;
    let idSort    = null;

    if ([1, -1].indexOf(direction) === -1) {direction = -1;}
    if (startTime.toString() !== 'Invalid Date') { dateQuery.$gt = startTime; }
    if (endTime.toString() !== 'Invalid Date') { dateQuery.$lt = endTime; }
    if (_.isEmpty(dateQuery)) { dateQuery = null; }
    if (req.user && type) {
        if (type === 'mine') { 
            author = req.user.username; 
        } else if (type === 'others') { 
            author = {$nin: [req.user.username]};
        }
    }
    status = req.user ? status : 'published';
    if (status === 'all') {
        author = req.user.username;
        status = {$in: ['published', 'unpublished', 'draft']};
    } else {
        status = 'published';
    }

    if (id) {
        if (direction === -1) {
            idSort = {$gt: id};
        } else {
            idSort = {$lt: id};
        }
    }

    postApi.get({
        status           : status, 
        'author.username': author,
        create           : dateQuery,
        title            : search,
        'category.name'  : category,
        '_id'            : idSort,
        isHistory        : false
    }, amount, page).then((data) => {
        res.json({code: 0, data: data});
    }).catch((err) => {
        res.json({code: 1, msg: err.message});
        log.error(err);
    });
};

const getPost = (req, res) => {
    let id = req.params.id;
    let history = req.query.history;
    let amount = req.query.amount || 20;
    let page = req.query.page || 1;

    postApi.getById(id).then(function (data) {
        let post = data.data[0];
        if (!data.total ) {
            res.json({code: -5, msg: '找不到该文章。'});
            return;
        }

        let isOwn     = req.user && req.user.username === post.author.username;
        let published = post.status === 'published';

        if (isOwn) {
            if (history) {
                return postApi.get({
                    isHistory: true,
                    original: id
                }, amount, page).then(function (data) {
                    res.json({code: 0, data: data});
                });
            } else {
                res.json({code: 0, data: post});
            }
        } else {
            if (history) {
                res.json({code: -1, msg: '权限不足。'});
            } else if (published) {
                res.json({code: 0, data: post});
            } else {
                res.json({code: -5, msg: '找不到该文章。'});
            }
        }
    }).catch(function (err) {
        log.error(err);
        res.json({code: 1, msg: err.message});
    });
};

const update = (req, res) => {
    let id       = req.params.id;
    let title    = req.body.title;
    let author   = req.user;
    let slug     = req.body.slug;
    let markdown = req.body.markdown;
    let html     = req.body.html;
    let tags     = req.body.tags;
    let status   = req.body.status;
    let category = req.body.category;

    req.checkBody('_id', '文章ID为空')
        .notEmpty();
    req.checkBody('title', '文章标题为空。')
        .notEmpty();
    req.checkBody('category', '文章分类为空。')
        .notEmpty();
    req.checkBody('status', '文章状态有误。')
        .isPostStatus();

    if (checkBodyError(req, res)) { return; }
    
    categoryApi.getById(category._id).then((data) => {
        if (!data.total) {
            throw {code: -5, message: '找不到该文章分类。'};
        }
        return data.data[0];
    }).then((category) => {
        postApi.getById(id).then((data) => {
            if (!data.total) {
                res.json({code: -5, msg: '找不到该文章。'});
                return;
            }
            let post = data.data[0];
            if (['published', 'unpublished'].indexOf(status) !== -1) {
                var originalPost = _.clone(post._doc);
                delete originalPost._id;
                return postApi.create(_.extend(originalPost, {
                    isHistory: true,
                    original : post._id,
                    isDraft  : false
                })).then(function () {
                    return postApi.update(id, {
                        title : title,
                        create: new Date(),
                        author: {
                            username: author.username,
                            id      : author._id,
                            avatar  : author.avatar
                        },
                        slug,
                        markdown,
                        html,
                        tags    : tags,
                        status,
                        category: {
                            name: category.name,
                            _id  : category._id
                        },
                        excerpt  : htmlToText.fromString(html).substring(0, 350),
                        isHistory: false,
                        isDraft  : false
                    });
                });
            } else if (status === 'draft') {
                return postApi.create({
                    title,
                    create: new Date(),
                    author: {
                        username: author.username,
                        id      : author._id,
                        avatar  : author.avatar
                    },
                    slug,
                    markdown,
                    html,
                    tags    : tags,
                    status,
                    category: {
                        name: category.name,
                        _id : category._id
                    },
                    excerpt  : htmlToText.fromString(html).substring(0, 350),
                    isHistory: true,
                    original : post._id
                }).then(function () {
                    return post;
                });
            } else {
                return Promise.reject({code: -1, err: {message: '文章状态不合法。'}});
            }
        }).then((post) => {
            res.json({code: 0, data: post});
        }).catch((err) => {
            res.json({code: err.code || 1, error: err.message});
            log.error(err);
        });
    });
};

const create = (req, res) => {
    let title    = req.body.title;
    let author   = req.user;
    let slug     = req.body.slug;
    let markdown = req.body.markdown;
    let html     = req.body.html;
    let tags     = req.body.tags;
    let status   = req.body.status;
    let category = req.body.category;

    req.checkBody('title', '文章标题为空。')
        .notEmpty();
    req.checkBody('category', '文章分类为空。')
        .notEmpty();
    req.checkBody('status', '文章状态有误。')
        .isPostStatus();

    if (checkBodyError(req, res)) { return; }
    
    categoryApi.getById(category).then((data) => {
        if (!data.total) {
            throw ({code: -5, message: '找不到该文章分类。'});
        }
        let category = data.data[0];
        return postApi.create({
            title,
            create: new Date(),
            author: {
                username: author.username,
                id      : author._id,
                avatar  : author.avatar
            },
            slug,
            markdown,
            html,
            tags    : (tags || '').split(','),
            status,
            category: {
                name: category.name,
                _id : category._id
            },
            excerpt  : htmlToText.fromString(html).substring(0, 350),
            isHistory: false
        });
    }).then((post) => {
        res.json({code: 0, data: post});
    }).catch((err) => {
        res.json({code: err.code || 1, error: err.message});
        log.error(err);
    });
};

const del = (req, res) => {
    let id = req.params.id;

    req.checkBody('id', '文章ID为空。')
        .notEmpty();

    if (checkBodyError(req, res)) { return; }

    postApi.getById(id).then((data) => {
        if (!data.total) { throw {code: -4, message: '文章不存在。'}; }
        return postApi.delete(id);
    }).then(() => {
        res.json({code: 0});
    }).catch((err) => {
        res.json({code: err.code || 1, error: err.message});
        log.error(err);
    });

};

export default {list, update, create, getPost, delete: del};