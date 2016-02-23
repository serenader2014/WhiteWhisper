import categoryApi    from '../api/category';
import log            from '../helper/log';
import checkBodyError from '../middleware/check-body-error';

export default {
    list (req, res) {
        let page      = req.query.page || 1;
        let amount    = req.query.amount || 20;
        let id        = req.query.id;
        let direction = +req.query.direction;
        if ([1, -1].indexOf(direction) === -1) {
            direction = -1;
        }
        let conditions = {};
        if (id) {
            if (direction === -1) {
                conditions['_id'] = {$gt: id};
            } else {
                conditions['_id'] = {$lt: id};
            }
        }
        categoryApi.get(conditions, amount, page).then((data) => {
            res.json({code: 0, data: data});
        }).catch((err) => {
            res.json({code: -1, err: err});
            log.error(err);
        });
    },
    getCategory (req, res) {
        let id = req.params.id;
        categoryApi.getById(id).then((data) => {
            if (!data.total) {
                res.json({code: -5, msg: '找不到该分类。'});
                return;
            }
            res.json({code: 0, data: data.data[0]});
        }).catch((err) => {
            log.error(err);
            res.json({code: 1, err: err});
        });
    },
    create (req, res) {
        let name = req.body.name;

        req.checkBody('name', '分类名为空。')
            .notEmpty();

        if (checkBodyError(req, res)) { return; }

        categoryApi.getByName(name).then((data) => {
            if (data.total) {
                throw {
                    message: '分类名称已存在。',
                    code: -5
                };
            }
            return categoryApi.create({name: name});
        }).then((category) => {
            res.json({code: 0, data: category});
        }).catch((err) => {
            res.json({code: err.code || 1, error: err.message});
            log.error(err);
        });
    },
    update (req, res) {
        let id = req.params.id;
        let name = req.body.name;

        req.checkBody('name', '分类名称为空。')
            .notEmpty();

        if (checkBodyError(req, res)) { return ; }

        categoryApi.update(id, {name: name}).then((category)  => {
            res.json({code: 0, data: category});
        }).catch((err)  => {
            res.json({ code: err.code || 1, error: err});
            log.error(err);
        });
    },
    delete (req, res) {
        let id = req.params.id;

        if (checkBodyError(req, res)) { return ; }

        categoryApi.getById(id).then((data) => {
            if (!data.total) { throw { code: -5, message: '分类不存在。'}; }
            let category = data.data[0];
            if (category.count > 0) { 
                throw { code: 1, message: '无法删除仍有文章的分类。'};
            }
            return categoryApi.delete(id);
        }).then(() => {
            res.json({ code: 0 });
        }).catch((err) => {
            res.json({ code: err.code || 1, error: err.message || err});
            log.error(err);
        });
    }
};