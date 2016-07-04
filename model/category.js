import bookshelf from '../db/bookshelf';

export default class Category extends bookshelf.Model {
    get tableName() {
        return 'category';
    }
}
