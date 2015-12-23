import  _        from 'lodash';
import  Category from '../model/category';
import  postApi  from './post';
import  get      from '../helper/get-data';

export default {
    get () {
        return get.apply(Category, arguments);
    },
    update (id, options) {
        var obj = {};
        var category;
        _.extend(obj, options);

        return Category.findByIdAndUpdateAsync(id, obj, {new: true}).then((c) => {
            category = c;
            return postApi.get({'category.id': id});
        }).then((data) => {
            if (!data.total) {
                return ;
            }
            return data.data.reduce((p, post) => {
                return p.then(() => {
                    post.category.name = options.name;
                    return post.saveAsync();
                });
            }, Promise.resolve());
        }).then(() => {
            return category;
        });
    },
    create (options) {
        var category = new Category();
        _.extend(category, options);

        return category.saveAsync().spread((c) => {
            return c;
        });
    },
    delete (id) {
        return Category.findByIdAndRemoveAsync(id);
    },
    increaseCount (id) {
        return Category.findByIdAsync(id).then((c) => {
            c.count = c.count + 1;
            return c.saveAsync();
        });
    },
    decreaseCount (id) {
        return Category.findByIdAsync(id).then((c) => {
            c.count = c.count - 1;
            return c.saveAsync();
        });
    },
    getById (id) {
        return this.get({_id: id}, 1, 1);
    },
    getByName (name) {
        return this.get({name: name}, 1,1);
    },
    getAll () {
        return this.get({}, 10, 1);
    }
};