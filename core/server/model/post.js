import Promise  from 'bluebird';
import mongoose from 'mongoose';
const mongo      = Promise.promisifyAll(mongoose);
const Schema     = mongo.Schema;
const ObjectId   = Schema.Types.ObjectId;
const PostSchema = new Schema({
    title : String,
    create: Date,
    author: {
        username: String,
        id      : ObjectId,
        avatar  : String
    },
    slug    : String,
    markdown: String,
    html    : String,
    tags    : Array, // [{name: String, id: ObjectId}, ...]
    excerpt : String,
    status  : String, // 'published', 'unpublished', 'deleted', 'draft'
    category: {
        name: String,
        _id : ObjectId
    },
    isHistory : Boolean,
    original  : ObjectId
});
export default mongo.model('Post', PostSchema);