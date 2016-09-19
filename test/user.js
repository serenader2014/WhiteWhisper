import 'should';
import request from 'supertest';
import _ from 'lodash';
import {
    appUrl,
    generatePassword,
    registerUser,
    createUser,
} from './utils';
import * as errCode from '../constant/err-code';

const userInfoUrl = '/api/user/';

describe('User test', () => {
    let user1 = null;
    let user2 = null;

    it('Should get a user\'s info', async () => {
        user1 = await createUser();
        return new Promise(resolve => {
            request(appUrl)
                .get(`${userInfoUrl}${user1.id}?token=${user1.token}`)
                .end((err, res) => {
                    if (err) throw err;
                    res.body.code.should.equal(0);
                    res.body.data.email.should.equal(user1.email);
                    resolve();
                });
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

    it('Should update user info', async () => {
        user2 = await createUser();
        const newUserInfo = {
            username: '新的用户名',
            bio: 'I love you from the first moment I saw you.',
            website: 'http://www.example.com',
            location: 'Guangdong, China',
            language: 'zh-cn',
        };
        return new Promise(resolve => {
            request(appUrl)
                .put(`${userInfoUrl}${user2.id}?token=${user2.token}`)
                .send(newUserInfo)
                .end((err, res) => {
                    if (err) throw err;
                    res.body.code.should.equal(0);
                    res.body.data.username.should.equal(newUserInfo.username);
                    user2 = _.extend({}, user2, newUserInfo);
                    resolve();
                });
        });
    });

    it('Should try to update user info using an existing username', done => {
        request(appUrl)
            .put(`${userInfoUrl}${user1.id}?token=${user1.token}`)
            .send({ username: user2.username })
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(errCode.user.usernameTaken);
                done();
            });
    });

    it('Should try to update other user\'s userinfo', done => {
        request(appUrl)
            .put(`${userInfoUrl}${user2.id}?token=${user1.token}`)
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
            .post(`${userInfoUrl}${user1.id}/password?token=${user1.token}`)
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
            .post(`${userInfoUrl}${user2.id}/password?token=${user1.token}`)
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
            .post(`${userInfoUrl}${user1.id}/password?token=${user1.token}`)
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
            .post(`${userInfoUrl}${user1.id}/password?token=${user1.token}`)
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
            .post(`${userInfoUrl}${user1.id}/password?token=${user1.token}`)
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

    it('should list users', done => {
        request(appUrl)
            .get(userInfoUrl)
            .end((req, res) => {
                res.body.code.should.equal(0);
                done();
            });
    });

    it('should show users list pagination', async () => {
        await registerUser();
        await registerUser();
        await registerUser();
        await registerUser();
        await registerUser();

        return new Promise((resolve) => {
            request(appUrl)
                .get(`${userInfoUrl}?page=2&pageSize=4`)
                .end((req, res) => {
                    res.body.code.should.equal(0);
                    res.body.data.pagination.rowCount.should.greaterThan(4);
                    resolve();
                });
        });
    });
});
