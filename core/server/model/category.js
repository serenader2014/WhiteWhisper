var mongoose       = Promise.promisifyAll(require('mongoose'));
var Schema         = mongoose.Schema;
var CategorySchema = new Schema({
    name: {type: String, unique: true},
    count: {type: Number, default: 0}
});
module.exports = mongoose.model('Category', CategorySchema);