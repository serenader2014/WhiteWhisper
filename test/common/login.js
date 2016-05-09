/* jshint mocha:true */

/* eslint-disable no-unused-vars */
import should  from 'should';
import request from 'supertest';
import getError from '../../core/shared/constants/error-code';

const url         = 'http://localhost:10011';
const register    = '/api/register';
const login       = '/api/login';
const currentUser = '/api/user';
const logout      = '/api/logout';

const randomString = (length) => 'abcdefghijklmnopqrstuvwxyz'
    .sort(() => Math.random() - 0.5)
    .slice(0, length).join('');

export default () => {
    const obj = {};
    const user = {
        email   : `${randomString(6)}@${randomString(4)}.com`,
        password: '123456789',
    };

    obj.randomUser = user;

    obj.register = () => {
        it(`should create random account ${user.email}`, (done) => {
            request(url)
                .post(register)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }
                    res.body.code.should.equal(0);
                    done();
                });
        });
    };

    const agent = request.agent(url);

    obj.agent = agent;

    obj.login = () => {
        it(`should login to server using the random account ${user.email}`, (done) => {
            agent
                .post(login)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }
                    res.body.code.should.equal(0);
                    done();
                });
        });
        it('should show the current logined user', (done) => {
            agent
                .get(currentUser)
                .end((err, res) => {
                    if (err) { throw err; }
                    res.body.code.should.equal(0);
                    res.body.data.email.should.equal(user.email);
                    done();
                });
        });
    };

    obj.logout = () => {
        it('should logout the current user', (done) => {
            agent
                .get(logout)
                .end((err, res) => {
                    if (err) { throw err; }
                    res.body.code.should.equal(0);
                    done();
                });
        });
        it('should show empty user on current user api route', (done) => {
            agent
                .get(currentUser)
                .end((err, res) => {
                    if (err) { throw err; }
                    res.body.code.should.equal(getError().code);
                    done();
                });
        });
    };
    return obj;
};

module.exports.randomString = randomString;
