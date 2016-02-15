/* jshint mocha:true */

var mongoose = require('mongoose');
var fs       = require('fs');
var path     = require('path');

describe('Drop the test database', function () {
    before(function (done) {
        this.timeout(20000);
        mongoose.connect('mongodb://127.0.0.1/whitewhispertest', function () {
            mongoose.connection.db.dropDatabase();
            mongoose.connection.close(function () {
                require('babel-core/register');
                require('../app.js').default('test').then(function () {
                    done();
                });
            });
        });
    });
    var files = fs.readdirSync(__dirname);

    files.forEach(function (file) {
        var stat = fs.statSync(path.resolve(__dirname,  file));
        if (stat.isFile() && path.extname(file) === '.js' && file !== 'index.js'){
            require(path.join(__dirname, file));
        }
    });
});