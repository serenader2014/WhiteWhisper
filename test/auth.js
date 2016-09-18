import 'should';
import request from 'supertest';
import { generateUserInfo, appUrl, registerUrl, authUrl } from './utils';

import * as errCode from '../constant/err-code';

const userInfoUrl = '/api/i';

describe('Auth test', () => {
    let token = null;
    const user1 = generateUserInfo();
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
            .send(generateUserInfo())
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(errCode.login.alreadyLogin);
                done();
            });
    });
});
