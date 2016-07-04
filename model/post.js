import bookshelf from '../db/bookshelf';

export default class Post extends bookshelf.Model {
    get tableName() {
        return 'post';
    }
}
