var mongoose         = Promise.promisifyAll(require('mongoose'));
var Schema           = mongoose.Schema;
var PermissionSchema = new Schema({
    name: {type: String, unique: true},
    editable: Boolean,
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
module.exports = mongoose.model('Permission', PermissionSchema);