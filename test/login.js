/* jshint jasmine:true */

var should   = require('should');
var assert   = require('assert');
var request  = require('supertest');
var _        = require('lodash');
var url      = 'http://localhost:10010';
var register = '/api/register';
var login    = '/api/login';
function randomString (length) {
    var str = 'abcdefghijklmnopqrstuvwxyz';
    return str.split('').sort(function () {return Math.random() - 0.5;}).slice(0, length).join('');
}

describe('User system unit test: login and register', function () {
    var user = {
        email: randomString(6) + '@' + randomString(4) + '.com',
        password: '123456789'
    };
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
                password: 'fakeemail'
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
                password: '1'
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(-3);
                done();
            });
    });
    it('should create random account ' + user.email, function (done) {
        request(url)
            .post(register)
            .send(user)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(0);
                done();
            });
    });
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
    it('should login to server using the random account ' + user.email, function (done) {
        request(url)
            .post(login)
            .send(user)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(0);
                done();
            });
    });
    it('will try to use the wrong password to login ' + user.email, function (done) {
        request(url)
            .post(login)
            .send({
                email: user.email,
                password: 'wrongpassword'
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(-5);
                done();
            });
    });
    
});