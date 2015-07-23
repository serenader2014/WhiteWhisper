var get            = require('../helper/get-data');
var _              = require('lodash');
var mongoose       = Promise.promisifyAll(require('mongoose'));
var Schema         = mongoose.Schema;
var CategorySchema = new Schema({
    name: {type: String, unique: true},
    count: {type: Number, default: 0}
});

CategorySchema.statics.get = function () {
    return get.apply(this, arguments);
};

CategorySchema.statics.update = function (id, options) {
    var obj = {};
    _.extend(obj, options);

    return this.findByIdAndUpdateAsync(id, obj);
};

CategorySchema.statics.create = function (options) {
    var category = new this();
    _.extend(category, options);

    return category.saveAsync().spread(function (c) {
        return c;
    });
};

CategorySchema.statics.delete = function (id) {
    return this.findByIdAndRemoveAsync(id);
};

CategorySchema.statics.increaseCount = function (id) {
    return this.findByIdAsync(id).then(function (c) {
        c.count = c.count + 1;
        return c.saveAsync();
    });
};

CategorySchema.statics.decreaseCount = function (id) {
    return this.findByIdAsync(id).then(function (c) {
        c.count = c.count - 1;
        return c.saveAsync();
    });
};

module.exports = mongoose.model('Category', CategorySchema);