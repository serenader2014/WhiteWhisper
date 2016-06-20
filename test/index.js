/* jshint mocha:true */

import path from 'path';
import config from '../config';

global.Promise = require('bluebird');
global.fs = Promise.promisifyAll(require('fs'));

const dbDir = path.join(config.appRoot, config.test.db.connection.filename);

function resetDB() {
    return fs.statAsync(dbDir).then(stat => {
        if (stat.isFile()) {
            return fs.unlinkAsync(dbDir);
        }
    }).catch(e => {
        if (e.code === 'ENOENT') {
            return;
        }
        throw e;
    });
}

process.NODE_ENV = 'test';

describe('Begin api server test', () => {
    before(function (){
        this.timeout(20000);
        return resetDB().then(() => {
            require('../utils/startup-check').default();
            return require('../index.js').default();
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
