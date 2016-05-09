/* jshint mocha:true */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

describe('Drop the test database', () => {
    before(function beforeTask(done) {
        this.timeout(20000);
        mongoose.connect('mongodb://127.0.0.1/whitewhispertest', () => {
            mongoose.connection.db.dropDatabase();
            mongoose.connection.close(() => {
                /* eslint-disable global-require */
                require('babel-core/register');
                require('../core/server').default('test').then(() => {
                    done();
                });
            });
        });
    });
    const files = fs.readdirSync(__dirname);

    files.forEach((file) => {
        const stat = fs.statSync(path.resolve(__dirname, file));
        if (stat.isFile() && path.extname(file) === '.js' && file !== 'index.js') {
            require(path.join(__dirname, file));
        }
    });
});
