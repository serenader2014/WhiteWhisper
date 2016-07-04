import bookshelf from '../db/bookshelf';
import bcrypt from 'bcrypt-nodejs';

const crypt = Promise.promisifyAll(bcrypt);

export default class User extends bookshelf.Model {
    get tableName() {
        return 'user';
    }

    static generatePassword(password) {
        return crypt.hashSync(password, crypt.genSaltSync(8), null);
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

    static byEmail(email) {
        return this.forge()
            .query('where', 'email', '=', email)
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
