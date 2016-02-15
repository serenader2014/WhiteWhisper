/* jshint mocha:true */

var request = require('supertest');
var should  = require('should');

var url = 'http://localhost:10011';
var categoryUrl = '/api/category';

function param (obj) {
    if (typeof obj !== 'object') {return '';}
    var arr = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            arr.push(i + '=' + obj[i]);
        }
    }
    return arr.join('&');
}


module.exports = function () {
    var obj = {};

    obj.list = function (agent, query, condiction) {
        it('should request the category list', function (done) {
            (agent || request(url))
                .get(query ? categoryUrl + '?' + param(query) : categoryUrl)
                .end(function (err, res) {
                    if (err) {throw err;}
                    res.body.code.should.equal(0);
                    if (typeof condiction === 'function') {
                        condiction(query, res);
                    }
                    done();
                });
        });
    };

    obj.create = function (agent, name, condiction) {
        it('should create a category', function (done) {
            (agent || request(url))
                .post(categoryUrl)
                .send({
                    name: name || 'test category'
                })
                .end(function (err, res) {
                    if (err) {throw err;}
                    res.body.code.should.equal(0);
                    if (typeof condiction === 'function') {
                        condiction(name, res);
                    }
                    done();
                });
        });
    };

    return obj;
};