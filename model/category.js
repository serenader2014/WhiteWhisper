import bookshelf from '../db/bookshelf';
import Post from './post';

export default class Category extends bookshelf.Model {
    get tableName() {
        return 'category';
    }

    static checkIfExist(obj) {
        return this.forge()
            .query(queryBuilder => {
                queryBuilder
                    .where('slug', obj.slug || '')
                    .orWhere('name', obj.name || '');
            })
            .fetch();
    }

    static create(category) {
        return this.forge(category)
            .save();
    }

    static query(queryObject, options) {
        return this.forge()
            .query('where', queryObject)
            .fetch(options);
    }

    post() {
        return this.hasMany(Post, 'category');
    }
}
