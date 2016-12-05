import bookshelf from '../db/bookshelf';
import User from './user';
import Category from './category';

export default class Post extends bookshelf.Model {
    get tableName() {
        return 'post';
    }

    static query(queryObject, options) {
        return this.forge()
            .query('where', queryObject)
            .fetch(options);
    }

    static create(post) {
        return this.forge(post)
            .save();
    }

    author() {
        return this.belongsTo(User, 'author');
    }

    category() {
        return this.belongsTo(Category, 'category');
    }
}
