import bookshelf from '../db/bookshelf';

const Post = bookshelf.Model.extend({
    tableName: 'post',
});
export default Post;
