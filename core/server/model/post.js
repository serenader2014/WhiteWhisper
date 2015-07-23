var mongoose   = Promise.promisifyAll(require('mongoose'));
var _          = require('lodash');
var get        = require('../helper/get-data');
var Category   = require('./category');
var Schema     = mongoose.Schema;
var ObjectId   = Schema.Types.ObjectId;
var PostSchema = new Schema({
    title : String,
    create: Date,
    author: {
        username: String,
        id      : ObjectId,
        avatar  : String
    },
    slug    : {type: String, unique: true},
    markdown: String,
    html    : String,
    tags    : Array, // [{name: String, id: ObjectId}, ...]
    excerpt : String,
    status  : String, // 'published', 'unpublished', 'deleted'
    category: {
        name: String,
        id  : ObjectId
    },
    draft: Array
});

PostSchema.statics.get = function () {
    return get.apply(this, arguments);
};

PostSchema.statics.create = function (options) {
    var post = new this();
    _.extend(post, options);

    return post.saveAsync().spread(function (post) {
        return post;
    });
};

PostSchema.statics.update = function (id, options) {
    var obj = {};
    var _this = this;
    _.extend(obj, options);

    return this.findByIdAsync(id).then(function (post) {
        if (post.status === 'published' && obj.status !== 'published') {
            return Category.decreaseCount(post.category.id);
        }
        if (post.status !== 'published' && obj.status === 'published') {
            return Category.increaseCount(obj.category.id);
        }
        if (post.status === 'published' && obj.status === 'published' &&
            post.category.name !== obj.category.name) {
            return Category.decreaseCount(post.category.id).then(function () {
                return Category.increaseCount(obj.category.id);
            });
        }
    }).then(function () {
        return _this.findByIdAndUpdateAsync(id, obj);
    });
};