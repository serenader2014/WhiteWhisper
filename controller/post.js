import _              from 'lodash';
import htmlToText     from 'html-to-text';
import mongoose       from 'mongoose';
import postApi        from '../api/post';
import categoryApi    from '../api/category';
import log            from '../helper/log';
import checkBodyError from '../middleware/check-body-error';
import * as errorCode from '../../shared/constants/error-code';
import successCode    from '../../shared/constants/success-code';

const list           = (req, res) => {
    const {
        page = 1,
        amount = 20,
        type,
        category,
        id,
    } = req.query;

    let {
        startTime,
        endTime,
        search,
        author,
        status,
        direction,
    } = req.query;

    [startTime, endTime] = [startTime, endTime].map(time => new Date(+time || time));
    search = search ? new RegExp(search, 'ig') : null;
    let dateQuery = {};
    let idSort    = null;

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
            res.json(errorCode.idFormatError('文章'));
            return;
        }
        if (direction === -1) {
            idSort = { $gt: id };
        } else {
            idSort = { $lt: id };
        }
    }

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
        res.json(errorCode.idFormatError('分类'));
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
    }, amount, page).then(data => res.json(successCode('获取文章列表成功', data))).catch((err) => {
        res.json({ code: 1, msg: err.message });
        log.error(err);
    });
};

const getPost = (req, res) => {
    const { id }      = req.params;
    const {
        history,
        amount = 20,
        page = 1,
    } = req.query;

    /* eslint-disable consistent-return */
    postApi.getById(id).then(data => {
        if (!data.total) {
            return Promise.reject(errorCode.getError('文章'));
        }

        const post = data.data[0];
        const isOwn     = req.user && req.user.username === post.author.username;
        const published = post.status === 'published';

        if (isOwn) {
            if (history) {
                return postApi.get({
                    isHistory: true,
                    original : id,
                }, amount, page).then(posts => res.json(successCode('获取文章历史记录成功', posts)));
            }
            res.json(successCode('获取文章成功', post));
        } else {
            if (history) {
                res.json(errorCode.noPermission());
            } else if (published) {
                res.json(successCode('获取文章成功', post));
            } else {
                res.json(errorCode.getError('文章'));
            }
        }
    }).catch((err) => {
        log.error(err);
        res.json({ code: err.code || 1, msg: err.msg || err.message });
    });
};

const update = (req, res) => {
    const { id } = req.params;
    const author = req.user;
    const {
        title,
        slug,
        markdown,
        html,
        tags,
        status,
        category,
    } = req.body;

    req.checkBody('_id', '文章ID为空')
        .notEmpty();
    req.checkBody('title', '文章标题为空。')
        .notEmpty();
    req.checkBody('category', '文章分类为空。')
        .notEmpty();
    req.checkBody('status', '文章状态有误。')
        .isPostStatus();

    if (checkBodyError(req, res)) { return; }
    categoryApi.getById(category._id).then(data => {
        if (!data.total) {
            return Promise.reject(errorCode.getError('分类'));
        }
        return data.data[0];
    }).then(targetCategory => {
        postApi.getById(id).then(data => {
            if (!data.total) {
                return Promise.reject(errorCode.getError('文章'));
            }
            const post = data.data[0];
            if (['published', 'unpublished'].indexOf(status) !== -1) {
                const originalPost = _.clone(post._doc);
                delete originalPost._id;
                return postApi.create(_.extend(originalPost, {
                    isHistory: true,
                    original : post._id,
                    isDraft  : false,
                })).then(() => postApi.update(id, {
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
                }));
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
                }).then(() => post);
            }
            return Promise.reject(errorCode.postStatusError());
        }).then((post) => res.json(successCode('文章更新成功', post))).catch((err) => {
            res.json({ code: err.code || 1, error: err.message });
            log.error(err);
        });
    });
};

const create = (req, res) => {
    const author   = req.user;
    const {
        title,
        slug,
        markdown,
        html,
        tags,
        status,
        category,
    } = req.body;

    req.checkBody('title', '文章标题为空。')
        .notEmpty();
    req.checkBody('category', '文章分类为空。')
        .notEmpty();
    req.checkBody('status', '文章状态有误。')
        .isPostStatus();

    if (checkBodyError(req, res)) { return; }

    categoryApi.getById(category).then(data => {
        if (!data.total) { return Promise.reject(errorCode.getError('分类')); }
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
    }).then((post) => res.json(successCode('文章创建成功', post))).catch((err) => {
        res.json({ code: err.code || 1, error: err.message });
        log.error(err);
    });
};

const del = (req, res) => {
    const { id } = req.params;

    req.checkBody('id', '文章ID为空。')
        .notEmpty();

    if (checkBodyError(req, res)) { return; }

    postApi.getById(id).then(data => {
        if (!data.total) { return Promise.reject(errorCode.getError('文章')); }
        return postApi.delete(id);
    }).then(() => res.json(successCode('文章删除成功'))).catch((err) => {
        res.json({ code: err.code || 1, error: err.message });
        log.error(err);
    });
};

export default { list, update, create, getPost, delete: del };
