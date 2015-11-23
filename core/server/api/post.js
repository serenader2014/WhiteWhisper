var Post        = require('../model').post;
var _           = require('lodash');
var get         = require('../helper/get-data');
var categoryApi = require('./category');

module.exports = {
    get: function () {
        return get.apply(Post, arguments);
    },
    create: function (options) {
        var post = new Post();
        _.extend(post, options);

        return post.saveAsync().spread(function (post) {
            if (post.status === 'published') {
                return categoryApi.increaseCount(post.category.id).then(function () {
                    return post;
                });
            } else {
                return post;
            }
        });
    },
    update: function (id, options) {
        var obj = {};
        _.extend(obj, options);

        return Post.findByIdAsync(id).then(function (post) {
            if (post.status === 'published' && obj.status !== 'published') {
                return categoryApi.decreaseCount(post.category.id);
            }
            if (post.status !== 'published' && obj.status === 'published') {
                return categoryApi.increaseCount(obj.category.id);
            }
            if (post.status === 'published' && obj.status === 'published' &&
                post.category.id !== obj.category.id) {
                return categoryApi.decreaseCount(post.category.id).then(function () {
                    return categoryApi.increaseCount(obj.category.id);
                });
            }
        }).then(function () {
            return Post.findByIdAndUpdateAsync(id, obj);
        });
    },
    getById: function (id) {
        return this.get({_id: id});
    },
    getByAuthor: function (username, amount, page) {
        return this.get({'author.name': username}, amount, page);
    },
    getBySlug: function (slug) {
        return this.get({slug: slug}, 1, 1);
    }
};