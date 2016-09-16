import bookshelf from '../db/bookshelf';
import User from './user';
import Category from './category';

export default class Post extends bookshelf.Model {
    get tableName() {
        return 'post';
    }

    static query(queryObject) {
        return this.forge()
            .query('where', queryObject)
            .fetch();
    }

    static create(post) {
        return this.forge(post)
            .save();
    }

    user() {
        return this.belongsTo(User);
    }

    category() {
        return this.belongsTo(Category);
    }
}
