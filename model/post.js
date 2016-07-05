import bookshelf from '../db/bookshelf';

export default class Post extends bookshelf.Model {
    get tableName() {
        return 'post';
    }

    static get(queryObject) {
        return this.forge()
            .query(queryBuilder => {
                queryBuilder
                    .where(queryObject);
            })
            .fetch();
    }
}
