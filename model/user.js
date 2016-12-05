import bookshelf from '../db/bookshelf';
import bcrypt from 'bcrypt-nodejs';
import Post from './post';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

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

    static query(queryObject, options) {
        return this.forge()
            .query('where', queryObject)
            .fetch(options);
    }

    static create(user) {
        return this.forge(user)
            .save();
    }

    posts() {
        return this.hasMany(Post, 'author');
    }

    validatePassword(password) {
        return crypt.compareAsync(password, this.get('password'));
    }

    login() {
        this.set('last_login', new Date());
        const token = jwt.sign(_.pick(this.attributes, [
            'id',
            'email',
            'username',
            'language',
        ]), config.secret, {
            expiresIn: 86400,
        });
        return this.save().then(() => token);
    }
}
