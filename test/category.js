import 'should';
import request from 'supertest';
import * as result from '../constant/err-code';
import { appUrl, categoryUrl, createUser, createCategory } from './utils';
import _ from 'lodash';

describe('Category test', () => {
    let user = null;

    before(async function before() {
        user = await createUser();
    });

    let category1 = null;
    it('should create a category', done => {
        request(appUrl)
            .post(`${categoryUrl}?token=${user.token}`)
            .send({ name: 'new category' })
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                category1 = res.body.data;
                done();
            });
    });

    it('should try to create duplicate category', done => {
        request(appUrl)
            .post(`${categoryUrl}?token=${user.token}`)
            .send({ name: 'new category' })
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(result.category.nameTaken);
                done();
            });
    });

    it('should list the categories', done => {
        request(appUrl)
            .get(`${categoryUrl}`)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                res.body.data.pagination.rowCount.should.equal(1);
                done();
            });
    });

    it('should get category info', done => {
        request(appUrl)
            .get(`${categoryUrl}/${category1.id}`)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                res.body.data.name.should.equal(category1.name);
                done();
            });
    });

    it('should update the category', done => {
        const newName = 'hahhahaahha';
        request(appUrl)
            .put(`${categoryUrl}/${category1.id}?token=${user.token}`)
            .send(_.extend({}, category1, {
                name: newName,
            }))
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                res.body.data.name.should.equal(newName);
                done();
            });
    });

    it('should delete the category', done => {
        request(appUrl)
            .delete(`${categoryUrl}/${category1.id}?token=${user.token}`)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                done();
            });
    });

    it('should list the categories', async () => {
        await createCategory();
        await createCategory();
        await createCategory();
        await createCategory();
        await createCategory();

        return new Promise(resolve => {
            request(appUrl)
                .get(`${categoryUrl}?pageSize=4`)
                .end((err, res) => {
                    if (err) throw err;
                    res.body.code.should.equal(0);
                    res.body.data.pagination.rowCount.should.equal(5);
                    res.body.data.pagination.pageCount.should.equal(2);
                    res.body.data.data.length.should.equal(4);
                    resolve();
                });
        });
    });
});
