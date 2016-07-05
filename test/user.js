import 'should';
import request from 'supertest';
import config from '../config';
import { generateUser } from './utils';
import * as errCode from '../constant/err-code';

const appUrl = `${config.test.host}:${config.test.port}`;
const userInfoUrl = '/api/user/';
const authUrl = '/api/auth';
const registerUrl = '/api/register';
const myselfInfoUrl = '/api/i';

describe('User system test', () => {
    let user = generateUser();
    let token = null;
    it('Should create a user first', done => {
        request(appUrl)
            .post(registerUrl)
            .send(user)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                done();
            });
    });

    it('Should auth the user', done => {
        request(appUrl)
            .post(authUrl)
            .send(user)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                token = res.body.data.token;
                done();
            });
    });

    it('Should get myself info', done => {
        request(appUrl)
            .get(`${myselfInfoUrl}?token=${token}`)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                user = res.body.data.user;
                done();
            });
    });

    it('Should get a user\'s info', done => {
        request(appUrl)
            .get(`${userInfoUrl}${user.id}?token=${token}`)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                res.body.data.email.should.equal(user.email);
                done();
            });
    });

    it('Should get a user\'s info without token', done => {
        request(appUrl)
            .get(`${userInfoUrl}${user.id}`)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(errCode.common.permissionDeny);
                done();
            });
    });

    it('Should update user info', done => {
        const newUserInfo = {
            username: '新的用户名',
            bio: 'I love you from the first moment I saw you.',
            website: 'http://www.example.com',
            location: 'Guangdong, China',
            language: 'zh-cn',
        };
        request(appUrl)
            .put(`${userInfoUrl}${user.id}?token=${token}`)
            .send(newUserInfo)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                done();
            });
    });
});
