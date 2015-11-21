var Category = require('../model').category;
var _ = require('lodash');
var get = require('../helper/get-data');

module.exports = {
    get: function () {
        return get.apply(Category, arguments);
    },
    update: function (id, options) {
        var obj = {};
        _.extend(obj, options);

        return Category.findByIdAndUpdateAsync(id, obj);
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
        return Category.get({_id: id}, 1, 1);
    },
    getByName: function (name) {
        return Category.get({name: name}, 1,1);
    },
    getAll: function () {
        return Category.get({}, 10, 1);
    }
};