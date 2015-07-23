var mongoose         = Promise.promisifyAll(require('mongoose'));
var get              = require('../helper/get-data');
var _                = require('lodash');
var Schema           = mongoose.Schema;
var PermissionSchema = new Schema({
    name: {type: String, unique: true},
    ediable: Boolean,
    post: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean
    },
    gallery: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean
    },
    attachment: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean
    },
    user: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean
    },
    setting: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean
    },
});

PermissionSchema.statics.get = function () {
    return get.apply(this, arguments);
};

PermissionSchema.statics.create = function (options) {
    var p = new this();
    _.extend(p, options);

    return p.saveAsync().spread(function (p) {
        return p;
    });
};

PermissionSchema.statics.update = function (id, options) {
    var obj = {};
    _.extend(obj, options);

    return this.findByIdAndUpdateAsync(id, obj);
};

PermissionSchema.statics.delete = function (id) {
    return this.findByIdAndRemoveAsync(id);
};

module.exports = mongoose.model('Permission', PermissionSchema);