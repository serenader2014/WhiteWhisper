import categoryApi    from '../api/category';
import log            from '../helper/log';
import checkBodyError from '../middleware/check-body-error';

export default {
    list(req, res) {
        const page      = req.query.page || 1;
        const amount    = req.query.amount || 20;
        const id        = req.query.id;
        let direction = +req.query.direction;
        if ([1, -1].indexOf(direction) === -1) {
            direction = -1;
        }
        const conditions = {};
        if (id) {
            if (direction === -1) {
                conditions._id = { $gt: id };
            } else {
                conditions._id = { $lt: id };
            }
        }
        categoryApi.get(conditions, amount, page).then((data) => {
            res.json({ code: 0, data });
        }).catch((err) => {
            res.json({ code: -1, err });
            log.error(err);
        });
    },
    getCategory(req, res) {
        const id = req.params.id;
        categoryApi.getById(id).then((data) => {
            if (!data.total) {
                res.json({ code: -5, msg: '找不到该分类。' });
                return;
            }
            res.json({ code: 0, data: data.data[0] });
        }).catch((err) => {
            log.error(err);
            res.json({ code: 1, err });
        });
    },
    create(req, res) {
        const name = req.body.name;

        req.checkBody('name', '分类名为空。')
            .notEmpty();

        if (checkBodyError(req, res)) { return; }

        categoryApi.getByName(name).then((data) => {
            if (data.total) {
                return Promise.reject({
                    message: '分类名称已存在。',
                    code   : -5,
                });
            }
            return categoryApi.create({ name });
        }).then((category) => {
            res.json({ code: 0, data: category });
        }).catch((err) => {
            res.json({ code: err.code || 1, error: err.message });
            log.error(err);
        });
    },
    update(req, res) {
        const id = req.params.id;
        const name = req.body.name;

        req.checkBody('name', '分类名称为空。')
            .notEmpty();

        if (checkBodyError(req, res)) { return; }

        categoryApi.update(id, { name }).then((category) => {
            res.json({ code: 0, data: category });
        }).catch((err) => {
            res.json({ code: err.code || 1, error: err });
            log.error(err);
        });
    },
    delete(req, res) {
        const id = req.params.id;

        if (checkBodyError(req, res)) { return; }

        categoryApi.getById(id).then((data) => {
            if (!data.total) { throw new Error({ code: -5, message: '分类不存在。' }); }
            const category = data.data[0];
            if (category.count > 0) {
                throw new Error({ code: 1, message: '无法删除仍有文章的分类。' });
            }
            return categoryApi.delete(id);
        }).then(() => {
            res.json({ code: 0 });
        }).catch((err) => {
            res.json({ code: err.code || 1, error: err.message || err });
            log.error(err);
        });
    },
};
