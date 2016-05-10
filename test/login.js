/* jshint mocha:true */

import should      from 'should';
import request     from 'supertest';

import LoginTest   from './common/login';
import * as errorCode from '../core/shared/constants/error-code';

const loginTest = LoginTest();

const url         = 'http://localhost:10011';
const register    = '/api/register';
const login       = '/api/login';
const logout      = '/api/logout';

describe('User system unit test: login and register', () => {
    const user = loginTest.randomUser;
    it(`will try to use the unregistered account to login ${user.email}`, (done) => {
        request(url)
            .post(login)
            .send(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(errorCode.authError().code);
                done();
            });
    });
    it('should submit empty request body to register', (done) => {
        request(url)
            .post(register)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(errorCode.formInvalid().code);
                done();
            });
    });
    it('will try to submit a fake email to reigster', (done) => {
        request(url)
            .post(register)
            .send({
                email   : 'fakeemail',
                password: 'fakeemail',
            })
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(errorCode.formInvalid().code);
                done();
            });
    });
    it('will try to submit a short password to reigster', (done) => {
        request(url)
            .post(register)
            .send({
                email   : 'test@test.com',
                password: '1',
            })
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(errorCode.formInvalid().code);
                done();
            });
    });

    loginTest.register();

    it(`should try create duplicate user ${user.email}`, (done) => {
        request(url)
            .post(register)
            .send(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(errorCode.emailExist().code);
                done();
            });
    });
    it(`will try to use the wrong password to login ${user.email}`, (done) => {
        request(url)
            .post(login)
            .send({
                email   : user.email,
                password: 'wrongpassword',
            })
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(errorCode.authError().code);
                done();
            });
    });
    const agent = loginTest.agent;

    loginTest.login();

    it('will try to login twice', (done) => {
        agent
            .post(login)
            .send(user)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.body.code.should.equal(errorCode.alreadyLogin().code);
                done();
            });
    });

    it('will try to register', (done) => {
        agent
            .post(register)
            .send(user)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(errorCode.alreadyLogin().code);
                done();
            });
    });

    loginTest.logout();

    it('will try to lotout again', (done) => {
        agent
            .get(logout)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(errorCode.notLogin().code);
                done();
            });
    });
});
