import Promise  from 'bluebird';
import mongoose from 'mongoose'
const mongo            = Promise.promisifyAll(mongoose);
const Schema           = mongo.Schema;
const PermissionSchema = new Schema({
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
export default mongo.model('Permission', PermissionSchema);