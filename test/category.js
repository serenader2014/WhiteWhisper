/* jshint mocha:true */

var should       = require('should');
var loginTest    = require('./common/login')();
var param        = require('./common/util').param;
var categoryUrl  = '/api/category';

describe('create account', function () {
    loginTest.register();
    loginTest.login();
    var agent = loginTest.agent;
    describe('category system test', function () {

        it('should list the category', function (done) {
            agent
                .get(categoryUrl)
                .end(function (err, res) {
                    if (err) {throw err;}
                    res.body.code.should.equal(0);
                    res.body.data.total.should.equal(1);
                    done();
                });
        });


        var tmpCategory = {};
        var categoryName = 'test';

        it('should create a category', function (done) {
            agent
                .post(categoryUrl)
                .send({name: categoryName})
                .end(function (err, res) {
                    if (err) {throw err;}
                    res.body.code.should.equal(0);
                    res.body.data.name.should.equal(categoryName);
                    tmpCategory = res.body.data;
                    done();
                });
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

        it('now it should have two category', function (done) {
            agent
                .get(categoryUrl)
                .end(function (err, res) {
                    if (err) {throw err;}
                    res.body.code.should.equal(0);
                    res.body.data.total.should.equal(2);
                    done();
                });
        });


        it('should update the category', function (done) {
            var newName = 'new name;';
            agent
                .put(categoryUrl + '/' + tmpCategory._id)
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
                .delete(categoryUrl + '/' + tmpCategory._id)
                .end(function (err, res) {
                    if (err) {throw err;}
                    res.body.code.should.equal(0);
                    done();
                });
        });


        it('now it should have only 1 category', function (done) {
            agent
                .get(categoryUrl)
                .end(function (err, res) {
                    if (err) {throw err;}
                    res.body.code.should.equal(0);
                    res.body.data.total.should.equal(1);
                    done();
                });
        });


        for (var i = 1; i < 20; i += 1) {
            (function (i) {
                var name = 'category name ' + i;
                it('create multiple category ' + name, function (done) {
                    agent
                        .post(categoryUrl)
                        .send({name: name})
                        .end(function (err, res) {
                            if (err) {throw err;}
                            res.body.code.should.equal(0);
                            res.body.data.name.should.equal(name);
                            done();
                        });
                });
                it('now it should have ' + i + 1 + ' category', function (done) {
                    agent
                        .get(categoryUrl)
                        .end(function (err, res) {
                            if (err) {throw err;}
                            res.body.code.should.equal(0);
                            res.body.data.total.should.equal(i + 1);
                            done();
                        });
                });
            })(i);
        }

        it('should return the correct data using pagination', function (done) {
            agent
                .get(categoryUrl + '?' + param({
                    page: 1,
                    amount: 10
                }))
                .end(function (err, res) {
                    if (err) {throw err;}
                    res.body.code.should.equal(0);
                    res.body.data.total.should.equal(20);
                    res.body.data.page.should.equal(1);
                    res.body.data.amount.should.equal(10);
                    res.body.data.data.length.should.equal(10);
                    done();
                });
        });

    });
});
