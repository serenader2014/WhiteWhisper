import 'should';
import request from 'supertest';
import config from '../config.js';

import * as errCode from '../constant/err-code';

const appUrl = `${config.test.host}:${config.test.port}`;

const registerUrl = '/api/register';
const authUrl = '/api/auth';
const userInfoUrl = '/api/i';

function randomString(length) {
    if (length < 1) return '';
    const str = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
    return `${str[Math.round(Math.random() * length)]}${randomString(length - 1)}`;
}

function generateUser() {
    return {
        email: `${randomString(5)}@domain.com`,
        password: randomString(10),
    };
}

describe('User system', () => {
    let token = null;
    const user1 = generateUser();
    it('Should create a new user', done => {
        request(appUrl)
            .post(registerUrl)
            .send(user1)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                done();
            });
    });

    it('Should auth the user', done => {
        request(appUrl)
            .post(authUrl)
            .send(user1)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                token = res.body.data.token;
                done();
            });
    });

    it('Should show the current user info', done => {
        request(appUrl)
            .get(`${userInfoUrl}?token=${token}`)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                done();
            });
    });

    it('Try to register again when user has already auth', done => {
        request(appUrl)
            .post(`${registerUrl}?token=${token}`)
            .send(generateUser())
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(errCode.login.alreadyLogin);
                done();
            });
    });
});
