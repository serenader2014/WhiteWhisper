import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const userObj = {
    username: String,
    id: ObjectId,
    image: String,
};
const PostSchema = new Schema({
    title: String,
    author: userObj,
    slug: String,
    text: String,
    html: String,
    image: String,
    tags: Array, // [{name: String, id: ObjectId}, ...]
    status: String, // 'published', 'unpublished', 'deleted', 'draft'
    category: {
        name: String,
        _id: ObjectId,
    },
    isHistory: Boolean,
    original: ObjectId,
    url: String,
    createdAt: Date,
    createdBy: userObj,
    updatedAt: Date,
    updatedBy: userObj,
    publishedAt: Date,
    publishedBy: userObj,
    featured: Boolean,
    page: Boolean,
});
export default mongoose.model('Post', PostSchema);
