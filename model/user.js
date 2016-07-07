import bookshelf from '../db/bookshelf';
import bcrypt from 'bcrypt-nodejs';

const crypt = Promise.promisifyAll(bcrypt);

export default class User extends bookshelf.Model {
    get tableName() {
        return 'user';
    }

    static checkIfExist(obj) {
        return this.forge()
            .query(queryBuilder => {
                queryBuilder
                    .where('email', obj.email || '')
                    .orWhere('username', obj.username || '');
            })
            .fetch();
    }

    static query(queryObject) {
        return this.forge()
            .query('where', queryObject)
            .fetch();
    }

    static create(user) {
        return this.forge(user)
            .save();
    }

    validatePassword(password) {
        return crypt.compareAsync(password, this.get('password'));
    }

    login() {
        this.set('last_login', new Date());
        return this.save();
    }
}
