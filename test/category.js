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
        var categoryName = 'test';
        categoryTest.create(agent, categoryName, function (name, res) {
            res.body.data.name.should.equal(name);
            tmpCategory = res.body.data;
        });
        it('should try to create duplicate category name', function (done) {
            agent
                .post(categoryUrl)
                .send({name: categoryName})
                .end(function (err, res) {
                    if (err) {throw err;}
                    res.body.code.should.equal(-5);
                    done();
                });
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


        for (var i = 1; i < 20; i += 1) {
            (function (i) {
                var name = 'category name ' + i;
                categoryTest.create(agent, name, function (name, res) {
                    res.body.data.name.should.equal(name);
                });
                categoryTest.list(null, null, function (query, res) {
                    res.body.data.total.should.equal(i+1);
                });
            })(i);
        }

        categoryTest.list(null, {
            page: 1,
            amount: 10
        }, function (query, res) {
            res.body.data.page.should.equal(query.page);
            res.body.data.amount.should.equal(query.amount);
            res.body.data.data.length.should.equal(query.amount);
        });

    });
});
