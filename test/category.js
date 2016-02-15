/* jshint mocha:true */

var should = require('should');
var loginTest = require('./common/login')();
var categoryTest = require('./common/category')();
var categoryUrl = '/api/category';

describe('create account', function () {
    loginTest.register();
    loginTest.login();
    var agent = loginTest.agent;
    describe('category system test', function () {
        categoryTest.list(agent, null, function (query, res) {
            res.body.data.total.should.equal(1);
        });
        var tmpCategory = {};
        categoryTest.create(agent, 'test', function (name, res) {
            res.body.data.name.should.equal(name);
            tmpCategory = res.body.data;
        });
        categoryTest.list(agent, null, function (query, res) {
            res.body.data.total.should.equal(2);
        });
        it('should update the category', function (done) {
            var newName = 'new name;';
            agent
                .put(categoryUrl)
                .send({
                    id: tmpCategory._id,
                    name: newName
                })
                .end(function (err, res) {
                    if (err) {throw err;}
                    res.body.code.should.equal(0);
                    res.body.data.name.should.equal(newName);
                    done();
                });
        });
        it('should delete the category', function (done) {
            agent
                .delete(categoryUrl)
                .send({id: tmpCategory._id})
                .end(function (err, res) {
                    if (err) {throw err;}
                    res.body.code.should.equal(0);
                    done();
                });
        });
        categoryTest.list(null, null, function (query, res) {
            res.body.data.total.should.equal(1);
        });
    });
});
