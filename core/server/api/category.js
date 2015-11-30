var _        = require('lodash');
var Category = require('../model').category;
var postApi  = require('./post');
var get      = require('../helper/get-data');

module.exports = {
    get: function () {
        return get.apply(Category, arguments);
    },
    update: function (id, options) {
        var obj = {};
        var category;
        _.extend(obj, options);

        return Category.findByIdAndUpdateAsync(id, obj, {new: true}).then(function (c) {
            category = c;
            return postApi.get({'category.id': id});
        }).then(function (data) {
            if (!data.total) {
                return ;
            }
            return data.data.reduce(function (p, post) {
                return p.then(function () {
                    post.category.name = options.name;
                    return post.saveAsync();
                });
            }, Promise.resolve());
        }).then(function () {
            return category;
        });
    },
    create: function (options) {
        var category = new Category();
        _.extend(category, options);

        return category.saveAsync().spread(function (c) {
            return c;
        });
    },
    delete: function (id) {
        return Category.findByIdAndRemoveAsync(id);
    },
    increaseCount: function (id) {
        return Category.findByIdAsync(id).then(function (c) {
            c.count = c.count + 1;
            return c.saveAsync();
        });
    },
    decreaseCount: function (id) {
        return Category.findByIdAsync(id).then(function (c) {
            c.count = c.count - 1;
            return c.saveAsync();
        });
    },
    getById: function (id) {
        return this.get({_id: id}, 1, 1);
    },
    getByName: function (name) {
        return this.get({name: name}, 1,1);
    },
    getAll: function () {
        return this.get({}, 10, 1);
    }
};