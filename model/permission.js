import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const userObj = {
    username: String,
    id: Schema.Types.ObjectId,
    image: String,
};
const PermissionSchema = new Schema({
    name: { type: String, unique: true },
    editable: Boolean,
    post: {
        get: Boolean,
        post: Boolean,
        put: Boolean,
        delete: Boolean,
    },
    category: {
        get: Boolean,
        post: Boolean,
        put: Boolean,
        delete: Boolean,
    },
    gallery: {
        get: Boolean,
        post: Boolean,
        put: Boolean,
        delete: Boolean,
    },
    attachment: {
        get: Boolean,
        post: Boolean,
        put: Boolean,
        delete: Boolean,
    },
    user: {
        get: Boolean,
        post: Boolean,
        put: Boolean,
        delete: Boolean,
    },
    setting: {
        get: Boolean,
        post: Boolean,
        put: Boolean,
        delete: Boolean,
    },
    createdAt: Date,
    createdBy: userObj,
    updatedAt: Date,
    updatedBy: userObj,
});
export default mongoose.model('Permission', PermissionSchema);
