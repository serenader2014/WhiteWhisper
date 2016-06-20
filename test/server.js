import 'should';
import request from 'supertest';
import config from '../config';


const appUrl = `${config.test.host}:${config.test.port}`;


describe('Check if server is running or not', () => {
    it('Shoud receive 200 in the request', done => {
        request(appUrl)
            .get('/')
            .expect(200)
            .end((err) => {
                if (err) {throw err;}
                done();
            });
    });
});
