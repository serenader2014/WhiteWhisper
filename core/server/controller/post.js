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

    postApi.get({
        status           : status, 
        'author.username': author,
        create           : dateQuery,
        title            : search,
        'category.name'  : category
    }, amount, page).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({code: 1, error: err.message});
        log.error(err);
    });
};

const update = (req, res) => {
    let id       = req.body.id;
    let title    = req.body.title;
    let author   = req.user;
    let slug     = req.body.slug;
    let markdown = req.body.markdown;
    let html     = req.body.html;
    let tags     = req.body.tags;
    let status   = req.body.status;
    let category = req.body.category;

    req.checkBody('id', '文章ID为空')
        .notEmpty();
    req.checkBody('title', '文章标题为空。')
        .notEmpty();
    req.checkBody('category', '文章分类为空。')
        .notEmpty();
    req.checkBody('status', '文章状态有误。')
        .isPostStatus();

    if (checkBodyError(req, res)) { return; }
    
    categoryApi.getById(category).then((data) => {
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
            let draft = post.draft;
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
                    slug,
                    markdown,
                    html,
                    tags    : (tags || '').split(','),
                    status,
                    category: {
                        name: category.name,
                        id  : category._id
                    },
                    excerpt : htmlToText.fromString(html).substring(0, 350),
                    draft
                });
            } else {
                draft.push({
                    title,
                    create  : new Date(),
                    slug,
                    markdown,
                    html,
                    tags    : (tags || '').split(','),
                    status,
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
                id  : category._id
            },
            excerpt : htmlToText.fromString(html).substring(0, 350),
        });
    }).then((post) => {
        res.json({code: 0, data: post});
    }).catch((err) => {
        res.json({code: err.code || 1, error: err.message});
        log.error(err);
    });
};

const del = (req, res) => {
    let id = req.body.id;

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

export default {list, update, create, delete: del};