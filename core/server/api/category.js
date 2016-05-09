import  _        from 'lodash';
import  Category from '../model/category';
import  postApi  from './post';
import  get      from '../helper/get-data';

export default {
    get(...args) {
        return get.apply(Category, args);
    },
    update(id, options) {
        const obj = {};
        let category;
        _.extend(obj, options);

        return Category.findByIdAndUpdateAsync(id, obj, { new: true }).then(c => {
            category = c;
            return postApi.get({ 'category.id': id });
        }).then(data => {
            /* eslint-disable consistent-return */
            if (!data.total) {
                return;
            }
            return data.data.reduce((p, post) => {
                /* eslint-disable no-param-reassign */
                const result = p.then(() => {
                    post.category.name = options.name;
                    return post.save();
                });
                return result;
            }, Promise.resolve());
        }).then(() => {
            const result = category;
            return result;
        });
    },
    create(options) {
        const category = new Category();
        _.extend(category, options);

        return category.save();
    },
    delete(id) {
        return Category.findByIdAndRemoveAsync(id);
    },
    increaseCount(id) {
        return Category.findByIdAsync(id).then((c) => {
            c.count = c.count + 1;
            return c.save();
        });
    },
    decreaseCount(id) {
        return Category.findByIdAsync(id).then((c) => {
            c.count = c.count - 1;
            return c.save();
        });
    },
    getById(id) {
        return this.get({ _id: id }, 1, 1);
    },
    getByName(name) {
        return this.get({ name }, 1, 1);
    },
    getAll() {
        return this.get({}, 10, 1);
    },
};
