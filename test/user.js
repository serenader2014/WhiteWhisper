import 'should';
import request from 'supertest';
import _ from 'lodash';
import { generateUser, generatePassword, appUrl } from './utils';
import * as errCode from '../constant/err-code';

const userInfoUrl = '/api/user/';
const authUrl = '/api/auth';
const registerUrl = '/api/register';

describe('User test', () => {
    let user1 = generateUser();
    let user2 = generateUser();
    let token = null;
    it('Should create a user first', done => {
        request(appUrl)
            .post(registerUrl)
            .send(user1)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                user1 = _.extend({}, user1, res.body.data);
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

    it('Should get a user\'s info', done => {
        request(appUrl)
            .get(`${userInfoUrl}${user1.id}?token=${token}`)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                res.body.data.email.should.equal(user1.email);
                done();
            });
    });

    it('Should get a user\'s info without token', done => {
        request(appUrl)
            .get(`${userInfoUrl}${user1.id}`)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(errCode.common.permissionDeny);
                done();
            });
    });

    it('Should create a new user', done => {
        request(appUrl)
            .post(registerUrl)
            .send(user2)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                user2 = _.extend({}, user2, res.body.data);
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
            .put(`${userInfoUrl}${user1.id}?token=${token}`)
            .send(newUserInfo)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                done();
            });
    });

    it('Should try to update user info using an existing username', done => {
        request(appUrl)
            .put(`${userInfoUrl}${user1.id}?token=${token}`)
            .send({ username: user2.username })
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(errCode.user.usernameTaken);
                done();
            });
    });

    it('Should try to update other user\'s userinfo', done => {
        request(appUrl)
            .put(`${userInfoUrl}${user2.id}?token=${token}`)
            .send({ username: 'newusername' })
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(errCode.common.permissionDeny);
                done();
            });
    });

    it('Should change password', done => {
        const newPassword = generatePassword(16);
        request(appUrl)
            .post(`${userInfoUrl}${user1.id}/password?token=${token}`)
            .send({
                newPassword,
                repeatPassword: newPassword,
                oldPassword: user1.password,
            })
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                done();
            });
    });

    it('Should try to change other user\'s password', done => {
        const newPassword = generatePassword(16);
        request(appUrl)
            .post(`${userInfoUrl}${user2.id}/password?token=${token}`)
            .send({
                newPassword,
                repeatPassword: newPassword,
                oldPassword: user2.password,
            })
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(errCode.common.permissionDeny);
                done();
            });
    });

    it('Should send inconsistent password', done => {
        const newPassword = generatePassword(16);
        request(appUrl)
            .post(`${userInfoUrl}${user1.id}/password?token=${token}`)
            .send({
                newPassword,
                repeatPassword: user1.password,
                oldPassword: user1.password,
            })
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(errCode.common.formInvalid);
                done();
            });
    });

    it('Should try to use a insecure password', done => {
        request(appUrl)
            .post(`${userInfoUrl}${user1.id}/password?token=${token}`)
            .send({
                newPassword: '12345678',
                repeatPassword: '12345678',
                oldPassword: user1.password,
            })
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(errCode.common.formInvalid);
                done();
            });
    });

    it('Should use a wrong password', done => {
        const newPassword = generatePassword(16);
        request(appUrl)
            .post(`${userInfoUrl}${user1.id}/password?token=${token}`)
            .send({
                newPassword,
                repeatPassword: newPassword,
                oldPassword: user2.password,
            })
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(errCode.user.passwordIncorrect);
                done();
            });
    });
});
