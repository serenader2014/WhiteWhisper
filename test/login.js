/* jshint mocha:true */

var should      = require('should');
var request     = require('supertest');

var loginTest   = require('./common/login')();

var url         = 'http://localhost:10011';
var register    = '/api/register';
var login       = '/api/login';
var logout      = '/api/logout';

describe('User system unit test: login and register', function () {
    var user = loginTest.randomUser;
    it('will try to use the unregistered account to login ' + user.email, function (done) {
        request(url)
            .post(login)
            .send(user)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(-5);
                done();
            });
    });
    it('should submit empty request body to register', function (done) {
        request(url)
            .post(register)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(-3);
                done();
            });
    });
    it('will try to submit a fake email to reigster', function (done) {
        request(url)
            .post(register)
            .send({
                email: 'fakeemail',
                password: 'fakeemail',
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(-3);
                done();
            });
    });
    it('will try to submit a short password to reigster', function (done) {
        request(url)
            .post(register)
            .send({
                email: 'test@test.com',
                password: '1',
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(-3);
                done();
            });
    });

    loginTest.register();

    it('should try create duplicate user ' + user.email, function (done) {
        request(url)
            .post(register)
            .send(user)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(-4);
                done();
            });
    });
    it('will try to use the wrong password to login ' + user.email, function (done) {
        request(url)
            .post(login)
            .send({
                email: user.email,
                password: 'wrongpassword',
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(-5);
                done();
            });
    });
    var agent = loginTest.agent;

    loginTest.login();

    it('will try to login twice', function (done) {
        agent
            .post(login)
            .send(user)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(-1);
                done();
            });
    });

    it('will try to register', function (done) {
        agent
            .post(register)
            .send(user)
            .end(function (err, res) {
                if (err) { throw err; }
                res.body.code.should.equal(-1);
                done();
            });
    });

    loginTest.logout();

    it('will try to lotout again', function (done) {
        agent
            .get(logout)
            .end(function (err, res) {
                if (err) { throw err; }
                res.body.code.should.equal(-1);
                done();
            });
    });
});
