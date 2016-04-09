import _              from 'lodash';
import htmlToText     from 'html-to-text';
import mongoose       from 'mongoose';
import postApi        from '../api/post';
import categoryApi    from '../api/category';
import log            from '../helper/log';
import checkBodyError from '../middleware/check-body-error';

const list           = (req, res) => {
    const page      = req.query.page || 1;
    const amount    = req.query.amount || 20;
    const type      = req.query.type;
    const startTime = new Date(+req.query.startTime || req.query.startTime);
    const endTime   = new Date(+req.query.endTime || req.query.endTime);
    const search    = req.query.search ? new RegExp(req.query.search, 'ig') : null;
    const category  = req.query.category;
    const id        = req.query.id;
    let author      = req.query.author;
    let status      = req.query.status;
    let dateQuery   = {};
    let direction   = +req.query.direction;
    let idSort      = null;

    if ([1, -1].indexOf(direction) === -1) { direction = -1; }
    if (startTime.toString() !== 'Invalid Date') { dateQuery.$gt = startTime; }
    if (endTime.toString() !== 'Invalid Date') { dateQuery.$lt = endTime; }
    if (_.isEmpty(dateQuery)) { dateQuery = null; }
    if (req.user && type) {
        if (type === 'mine') {
            author = req.user.username;
        } else if (type === 'others') {
            author = { $nin: [req.user.username] };
        }
    }
    status = req.user ? status : 'published';
    if (status === 'all') {
        author = req.user.username;
        status = { $in: ['published', 'unpublished', 'draft'] };
    } else {
        status = 'published';
    }

    if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.json({ code: -3, msg: '文章ID格式错误。' });
            return;
        }
        if (direction === -1) {
            idSort = { $gt: id };
        } else {
            idSort = { $lt: id };
        }
    }

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
        res.json({ code: -3, msg: '分类ID格式错误。' });
        return;
    }

    postApi.get({
        status,
        'author.username': author,
        create           : dateQuery,
        title            : search,
        'category._id'   : category,
        _id              : idSort,
        isHistory        : false,
    }, amount, page).then((data) => {
        res.json({ code: 0, data });
    }).catch((err) => {
        res.json({ code: 1, msg: err.message });
        log.error(err);
    });
};

const getPost = (req, res) => {
    const id      = req.params.id;
    const history = req.query.history;
    const amount  = req.query.amount || 20;
    const page    = req.query.page || 1;

    /* eslint-disable consistent-return */
    postApi.getById(id).then((data) => {
        const post = data.data[0];
        if (!data.total) {
            res.json({ code: -5, msg: '找不到该文章。' });
            return;
        }

        const isOwn     = req.user && req.user.username === post.author.username;
        const published = post.status === 'published';

        if (isOwn) {
            if (history) {
                return postApi.get({
                    isHistory: true,
                    original : id,
                }, amount, page).then((posts) => {
                    res.json({ code: 0, data: posts });
                });
            }
            res.json({ code: 0, data: post });
        } else {
            if (history) {
                res.json({ code: -1, msg: '权限不足。' });
            } else if (published) {
                res.json({ code: 0, data: post });
            } else {
                res.json({ code: -5, msg: '找不到该文章。' });
            }
        }
    }).catch((err) => {
        log.error(err);
        res.json({ code: 1, msg: err.message });
    });
};

const update = (req, res) => {
    const id       = req.params.id;
    const title    = req.body.title;
    const author   = req.user;
    const slug     = req.body.slug;
    const markdown = req.body.markdown;
    const html     = req.body.html;
    const tags     = req.body.tags;
    const status   = req.body.status;
    const category = req.body.category;

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
            throw new Error({ code: -5, message: '找不到该文章分类。' });
        }
        return data.data[0];
    }).then((targetCategory) => {
        postApi.getById(id).then((data) => {
            if (!data.total) {
                res.json({ code: -5, msg: '找不到该文章。' });
                return;
            }
            const post = data.data[0];
            if (['published', 'unpublished'].indexOf(status) !== -1) {
                const originalPost = _.clone(post._doc);
                delete originalPost._id;
                return postApi.create(_.extend(originalPost, {
                    isHistory: true,
                    original : post._id,
                    isDraft  : false,
                })).then(() => {
                    const result = postApi.update(id, {
                        title,
                        slug,
                        markdown,
                        html,
                        tags,
                        status,
                        create: new Date(),
                        author: {
                            username: author.username,
                            id      : author._id,
                            avatar  : author.avatar,
                        },
                        category: {
                            name: targetCategory.name,
                            _id : targetCategory._id,
                        },
                        excerpt  : htmlToText.fromString(html).substring(0, 350),
                        isHistory: false,
                        isDraft  : false,
                    });
                    return result;
                });
            } else if (status === 'draft') {
                return postApi.create({
                    title,
                    slug,
                    markdown,
                    html,
                    tags,
                    status,
                    create: new Date(),
                    author: {
                        username: author.username,
                        id      : author._id,
                        avatar  : author.avatar,
                    },
                    category: {
                        name: targetCategory.name,
                        _id : targetCategory._id,
                    },
                    excerpt  : htmlToText.fromString(html).substring(0, 350),
                    isHistory: true,
                    original : post._id,
                }).then(() => {
                    const result = post;
                    return result;
                });
            }
            return Promise.reject({ code: -1, err: { message: '文章状态不合法。' } });
        }).then((post) => {
            res.json({ code: 0, data: post });
        }).catch((err) => {
            res.json({ code: err.code || 1, error: err.message });
            log.error(err);
        });
    });
};

const create = (req, res) => {
    const title    = req.body.title;
    const author   = req.user;
    const slug     = req.body.slug;
    const markdown = req.body.markdown;
    const html     = req.body.html;
    const tags     = req.body.tags;
    const status   = req.body.status;
    const category = req.body.category;

    req.checkBody('title', '文章标题为空。')
        .notEmpty();
    req.checkBody('category', '文章分类为空。')
        .notEmpty();
    req.checkBody('status', '文章状态有误。')
        .isPostStatus();

    if (checkBodyError(req, res)) { return; }

    categoryApi.getById(category).then((data) => {
        if (!data.total) {
            throw new Error({ code: -5, message: '找不到该文章分类。' });
        }
        const targetCategory = data.data[0];
        return postApi.create({
            title,
            create: new Date(),
            author: {
                username: author.username,
                id      : author._id,
                avatar  : author.avatar,
            },
            slug,
            markdown,
            html,
            tags    : (tags || '').split(','),
            status,
            category: {
                name: targetCategory.name,
                _id : targetCategory._id,
            },
            excerpt  : htmlToText.fromString(html).substring(0, 350),
            isHistory: false,
        });
    }).then((post) => {
        res.json({ code: 0, data: post });
    }).catch((err) => {
        res.json({ code: err.code || 1, error: err.message });
        log.error(err);
    });
};

const del = (req, res) => {
    const id = req.params.id;

    req.checkBody('id', '文章ID为空。')
        .notEmpty();

    if (checkBodyError(req, res)) { return; }

    postApi.getById(id).then((data) => {
        if (!data.total) { throw new Error({ code: -4, message: '文章不存在。' }); }
        return postApi.delete(id);
    }).then(() => {
        res.json({ code: 0 });
    }).catch((err) => {
        res.json({ code: err.code || 1, error: err.message });
        log.error(err);
    });
};

export default { list, update, create, getPost, delete: del };
