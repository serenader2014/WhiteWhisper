import 'should';
import request from 'supertest';
import { appUrl, generateUser } from './utils';

const categoryUrl = '/api/category';
const authUrl = '/api/auth';
const registerUrl = '/api/register';

describe('Category test', () => {
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

    it('should create a category', done => {
        request(appUrl)
            .post(`${categoryUrl}?token=${token}`)
            .send({ name: 'new category' })
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                done();
            });
    });
});
