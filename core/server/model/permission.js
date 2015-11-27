var mongoose         = Promise.promisifyAll(require('mongoose'));
var Schema           = mongoose.Schema;
var PermissionSchema = new Schema({
    name: {type: String, unique: true},
    editable: Boolean,
    post: {
        get   : Boolean,
        post  : Boolean,
        put   : Boolean,
        delete: Boolean
    },
    category: {
        get   : Boolean,
        post  : Boolean,
        put   : Boolean,
        delete: Boolean
    },
    gallery: {
        get   : Boolean,
        post  : Boolean,
        put   : Boolean,
        delete: Boolean
    },
    attachment: {
        get   : Boolean,
        post  : Boolean,
        put   : Boolean,
        delete: Boolean
    },
    user: {
        get   : Boolean,
        post  : Boolean,
        put   : Boolean,
        delete: Boolean
    },
    setting: {
        get   : Boolean,
        post  : Boolean,
        put   : Boolean,
        delete: Boolean
    },
});
module.exports = mongoose.model('Permission', PermissionSchema);