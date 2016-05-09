import categoryApi    from '../api/category';
import log            from '../helper/log';
import checkBodyError from '../middleware/check-body-error';
import successCode    from '../../shared/constants/success-code';
import * as errorCode from '../../shared/constants/error-code';

export default {
    list(req, res) {
        const {
            page = 1,
            amount = 20,
            id,
        } = req.query;
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
        categoryApi.get(conditions, amount, page)
            .then(data => successCode('获取列表成功', data))
            .catch(err => {
                res.json({ code: -1, err });
                log.error(err);
            });
    },
    getCategory(req, res) {
        const { id } = req.params;
        categoryApi.getById(id).then(data => {
            if (!data.total) {
                return Promise.reject(errorCode.getError('分类'));
            }
            return res.json({ code: 0, data: data.data[0] });
        }).catch((err) => {
            log.error(err);
            res.json({ code: err.code || 1, msg: err.msg || err });
        });
    },
    create(req, res) {
        const { name } = req.body;

        req.checkBody('name', '分类名为空。')
            .notEmpty();

        if (checkBodyError(req, res)) { return; }

        categoryApi.getByName(name).then(data => {
            if (data.total) {
                return Promise.reject(errorCode.categoryExist());
            }
            return categoryApi.create({ name });
        }).then(category => successCode('创建分类成功', category)).catch((err) => {
            res.json({ code: err.code || 1, error: err.message });
            log.error(err);
        });
    },
    update(req, res) {
        const { id } = req.params;
        const { name } = req.body;

        req.checkBody('name', '分类名称为空。')
            .notEmpty();

        if (checkBodyError(req, res)) { return; }

        categoryApi.update(id, { name })
            .then(category => successCode('更新分类成功', category))
            .catch((err) => {
                res.json({ code: err.code || 1, error: err });
                log.error(err);
            });
    },
    delete(req, res) {
        const { id } = req.params;

        if (checkBodyError(req, res)) { return; }

        categoryApi.getById(id).then(data => {
            if (!data.total) { return Promise.reject(errorCode.categoryNotExist()); }
            const category = data.data[0];
            if (category.count > 0) {
                return Promise.reject(errorCode.categoryNotEmpty());
            }
            return categoryApi.delete(id);
        }).then(() => successCode('删除分类成功')).catch(err => {
            res.json({ code: err.code || 1, error: err.message || err });
            log.error(err);
        });
    },
};
