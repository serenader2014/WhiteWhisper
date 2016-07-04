/* jshint mocha:true */

import path from 'path';
import config from '../config';
import 'should';
import request from 'supertest';

global.Promise = require('bluebird');
global.fs = Promise.promisifyAll(require('fs'));

const dbDir = path.join(config.appRoot, config.test.db.connection.filename);
const appUrl = `${config.test.host}:${config.test.port}`;


function resetDB() {
    return fs.statAsync(dbDir).then(stat => stat.isFile() && fs.unlinkAsync(dbDir)).catch(e => {
        if (e.code === 'ENOENT') {
            return;
        }
        throw e;
    });
}

process.NODE_ENV = 'test';

describe('Begin api server test', () => {
    /* eslint-disable func-names */
    before(function () {
        this.timeout(20000);
        return resetDB().then(() => {
            /* eslint-disable global-require */
            require('../utils/startup-check').default();
            return require('../index.js').default();
        });
    });

    describe('Check if server is running or not', () => {
        it('Shoud receive 200 in the request', done => {
            request(appUrl)
                .get('/')
                .expect(200)
                .end((err) => {
                    if (err) { throw err; }
                    done();
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
