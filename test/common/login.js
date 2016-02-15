/* jshint mocha:true */

var should      = require('should');
var request     = require('supertest');

var url         = 'http://localhost:10011';
var register    = '/api/register';
var login       = '/api/login';
var currentUser = '/api/user';
var logout      = '/api/logout';

function randomString (length) {
    var str = 'abcdefghijklmnopqrstuvwxyz';
    return str.split('').sort(function () {return Math.random() - 0.5;}).slice(0, length).join('');
}

module.exports = function () {
    var obj = {};
    var user = {
        email: randomString(6) + '@' + randomString(4) + '.com',
        password: '123456789'
    };

    obj.randomUser = user;

    obj.register = function () {
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
    };

    var agent = request.agent(url);

    obj.agent = agent;

    obj.login = function () {
        it('should login to server using the random account ' + user.email, function (done) {
            agent
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
        it('should show the current logined user', function (done) {
            agent
                .get(currentUser)
                .end(function (err, res) {
                    if (err) {throw err;}
                    res.body.code.should.equal(0);
                    res.body.data.email.should.equal(user.email);
                    done();
                });
        });
    };

    obj.logout = function () {
        it('should logout the current user', function (done) {
            agent
                .get(logout)
                .end(function (err, res) {
                    if (err) {throw err;}
                    res.body.code.should.equal(0);
                    done();
                });
        });
        it('should show empty user on current user api route', function (done) {
            agent
                .get(currentUser)
                .end(function (err, res) {
                    if (err) {throw err;}
                    res.body.code.should.equal(-5);
                    done();
                });
        });
    };
    return obj;
};
