import 'should';
import request from 'supertest';
import config from '../config.js';

const appUrl = `${config.test.host}:${config.test.port}`;

const registerUrl = '/api/register';
const authUrl = '/api/auth';
const userInfoUrl = '/api/i';

const newUser = {
    email: 'test@test.com',
    password: 'testtest',
};

describe('User system', () => {
    let token = null;
    it('Should create a new user', done => {
        request(appUrl)
            .post(registerUrl)
            .send(newUser)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                done();
            });
    });

    it('Should auth the user', done => {
        request(appUrl)
            .post(authUrl)
            .send(newUser)
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
});
