var mongoose   = Promise.promisifyAll(require('mongoose'));
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
    slug    : String,
    markdown: String,
    html    : String,
    tags    : Array, // [{name: String, id: ObjectId}, ...]
    excerpt : String,
    status  : String, // 'published', 'unpublished', 'deleted', 'draft'
    category: {
        name: String,
        id  : ObjectId
    },
    draft: Array
});
module.exports = mongoose.model('Post', PostSchema);