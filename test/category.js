/* jshint mocha:true */

/* eslint-disable no-unused-vars */
import should         from 'should';
import login          from './common/login';
import { param }      from './common/util';
import * as errorCode from '../core/shared/constants/error-code';
const categoryUrl  = '/api/category';

const loginTest = login();

describe('create account', () => {
    loginTest.register();
    loginTest.login();
    const agent = loginTest.agent;
    describe('category system test', () => {
        it('should list the category', (done) => {
            agent
                .get(categoryUrl)
                .end((err, res) => {
                    if (err) { throw err; }
                    res.body.code.should.equal(0);
                    res.body.data.total.should.equal(1);
                    done();
                });
        });

        let tmpCategory = {};
        const categoryName = 'test';

        it('should create a category', (done) => {
            agent
                .post(categoryUrl)
                .send({ name: categoryName })
                .end((err, res) => {
                    if (err) { throw err; }
                    res.body.code.should.equal(0);
                    res.body.data.name.should.equal(categoryName);
                    tmpCategory = res.body.data;
                    done();
                });
        });


        it('should try to create duplicate category name', (done) => {
            agent
                .post(categoryUrl)
                .send({ name: categoryName })
                .end((err, res) => {
                    if (err) { throw err; }
                    res.body.code.should.equal(errorCode.categoryExist().code);
                    done();
                });
        });

        it('now it should have two category', (done) => {
            agent
                .get(categoryUrl)
                .end((err, res) => {
                    if (err) { throw err; }
                    res.body.code.should.equal(0);
                    res.body.data.total.should.equal(2);
                    done();
                });
        });

        it('should update the category', (done) => {
            const newName = 'new name;';
            agent
                .put(`${categoryUrl}/${tmpCategory._id}`)
                .send({
                    id  : tmpCategory._id,
                    name: newName,
                })
                .end((err, res) => {
                    if (err) { throw err; }
                    res.body.code.should.equal(0);
                    res.body.data.name.should.equal(newName);
                    done();
                });
        });

        it('should delete the category', (done) => {
            agent
                .delete(`${categoryUrl}/${tmpCategory._id}`)
                .end((err, res) => {
                    if (err) { throw err; }
                    res.body.code.should.equal(0);
                    done();
                });
        });

        it('now it should have only 1 category', (done) => {
            agent
                .get(categoryUrl)
                .end((err, res) => {
                    if (err) { throw err; }
                    res.body.code.should.equal(0);
                    res.body.data.total.should.equal(1);
                    done();
                });
        });

        for (let count = 1; count < 20; count += 1) {
            ((i) => {
                const name = `category name ${i}`;
                it(`create multiple category ${name}`, (done) => {
                    agent
                        .post(categoryUrl)
                        .send({ name })
                        .end((err, res) => {
                            if (err) { throw err; }
                            res.body.code.should.equal(0);
                            res.body.data.name.should.equal(name);
                            done();
                        });
                });
                it(`now it should have ${i + 1} category'`, (done) => {
                    agent
                        .get(categoryUrl)
                        .end((err, res) => {
                            if (err) { throw err; }
                            res.body.code.should.equal(0);
                            res.body.data.total.should.equal(i + 1);
                            done();
                        });
                });
            })(count);
        }

        it('should return the correct data using pagination', (done) => {
            agent
                .get(`${categoryUrl}?${param({
                    page  : 1,
                    amount: 10,
                })}`)
                .end((err, res) => {
                    if (err) { throw err; }
                    res.body.code.should.equal(0);
                    res.body.data.total.should.equal(20);
                    res.body.data.page.should.equal(1);
                    res.body.data.amount.should.equal(10);
                    res.body.data.data.length.should.equal(10);
                    done();
                });
        });
    });
});
