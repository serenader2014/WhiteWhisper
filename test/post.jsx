/* jshint mocha:true */

require('should');
import request        from 'supertest';
import _              from 'lodash';
import LoginTest      from './common/login';
import * as errorCode from '../core/shared/constants/error-code';

const loginTest = LoginTest();

const url         = 'http://localhost:10011';
const postUrl     = '/api/post';
const categoryUrl = '/api/category';
const loginUrl    = '/api/login';
const post        = {
    title   : 'test title',
    slug    : 'test title slug',
    markdown: '# test markdown',
    html    : '<h1>test markdown</h1>',
    tags    : 'tags, tags',
    status  : 'published',
};
const newPost = {
    title   : 'new title',
    markdown: '## new title',
    html    : '<h2>new title</h2>',
};

describe('create account', () => {
    loginTest.register();
    loginTest.login();
    const agent = loginTest.agent;


    it('should list post', (done) => {
        agent
            .get(postUrl)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                res.body.data.total.should.equal(0);
                done();
            });
    });


    let category;
    it('should get the a category', (done) => {
        agent
            .get(categoryUrl)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                category = res.body.data.data[0];
                done();
            });
    });

    it('should create new post', (done) => {
        agent
            .post(postUrl)
            .send(_.extend(post, { category: category._id }))
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                done();
            });
    });

    it('should increase the category post count', (done) => {
        agent
            .get(`${categoryUrl}/${category._id}`)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                res.body.data.count.should.equal(category.count + 1);
                done();
            });
    });


    let tmpPost;
    it('should list post', (done) => {
        agent
            .get(postUrl)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                res.body.data.total.should.equal(1);
                res.body.data.data[0].title.should.equal(post.title);
                tmpPost = res.body.data.data[0];
                done();
            });
    });

    it('should get single post', (done) => {
        agent
            .get(`${postUrl}/${tmpPost._id}`)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                res.body.data.title.should.equal(tmpPost.title);
                done();
            });
    });

    it('should update post', (done) => {
        agent
            .put(`${postUrl}/${tmpPost._id}`)
            .send(_.extend({}, tmpPost, newPost))
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                res.body.data.title.should.equal(newPost.title);
                res.body.data.markdown.should.equal(newPost.markdown);
                res.body.data.html.should.equal(newPost.html);
                done();
            });
    });

    it('should get post history', (done) => {
        agent
            .get(`${postUrl}/${tmpPost._id}?history=true`)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                res.body.data.total.should.equal(1);
                res.body.data.data[0].title.should.equal(tmpPost.title);
                done();
            });
    });

    it('should not show the history in the post list', (done) => {
        agent
            .get(postUrl)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                res.body.data.total.should.equal(1);
                done();
            });
    });

    it('should save a post draft', (done) => {
        agent
            .put(`${postUrl}/${tmpPost._id}`)
            .send(_.extend({}, tmpPost, newPost, { status: 'draft' }))
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                done();
            });
    });

    it('should have two post history now', (done) => {
        agent
            .get(`${postUrl}/${tmpPost._id}?history=true`)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                res.body.data.total.should.equal(2);
                res.body.data.data[0].status.should.equal('draft');
                done();
            });
    });

    it('should not change the previous post content', (done) => {
        agent
            .get(`${postUrl}/${tmpPost._id}`)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                res.body.data.status.should.equal(tmpPost.status);
                done();
            });
    });

    it('should reject the guest to view the post history', (done) => {
        request(url)
            .get(`${postUrl}/${tmpPost._id}?history=true`)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(errorCode.noPermission().code);
                done();
            });
    });
});

/* eslint-disable global-require */

describe('multiple user and post test', () => {
    const categoryList = [];

    const lt = require('./common/login')();
    lt.register();
    lt.login();
    const a = lt.agent;
    for (let o = 0; o < 20; o += 1) {
        (() => {
            const name = require('./common/login').randomString(6);
            it(`create multiple category ${name}`, (done) => {
                a
                    .post(categoryUrl)
                    .send({ name })
                    .end((err, res) => {
                        if (err) { throw err; }
                        res.body.code.should.equal(0);
                        res.body.data.name.should.equal(name);
                        categoryList.push(res.body.data);
                        done();
                    });
            });
        })(o);
    }
    lt.logout();

    let previousPostNumber = 0;

    it('should get current post list', (done) => {
        request(url)
            .get(postUrl)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                previousPostNumber = res.body.data.total;
                done();
            });
    });

    const totalPost = [];
    const totalUser = [];
    for (let i = 0; i < 20; i += 1) {
        const anotherLogin    = require('./common/login')();
        const randomString = require('./common/login').randomString;
        totalUser.push(anotherLogin.randomUser);
        anotherLogin.register();
        anotherLogin.login();
        const loginAgent = anotherLogin.agent;
        ((agent) => {
            const count        = Math.floor(Math.random() * 5);
            for (let j = 0; j < count; j += 1) {
                it('create post', (done) => {
                    const category     = categoryList[Math.floor(Math.random() * categoryList.length)];
                    const p         = _.extend({}, post, { title: randomString(10), category: category._id });
                    agent
                        .post(postUrl)
                        .send(p)
                        .end((err, res) => {
                            if (err) { throw err; }
                            res.body.code.should.equal(0);
                            totalPost.push(res.body.data);
                            done();
                        });
                });
            }
        })(loginAgent);
        anotherLogin.logout();
    }

    it('should list the total post', (done) => {
        request(url)
            .get(postUrl)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                res.body.data.total.should.equal(previousPostNumber + totalPost.length);
                done();
            });
    });

    for (let j = 0; j < totalUser.length; j += 1) {
        ((current) => {
            it('should filter post list by author', (done) => {
                const user = totalUser[current];
                const postNum = _.filter(totalPost,
                    item => item.author.username === user.email
                ).length;
                request(url)
                    .get(`${postUrl}?author=${user.email}`)
                    .end((err, res) => {
                        if (err) { throw err; }
                        res.body.code.should.equal(0);
                        res.body.data.total.should.equal(postNum);
                        done();
                    });
            });
        })(j);
    }

    const currentUser = totalUser[0];
    const loginAgent = request.agent(url);

    it(`should login to user ${currentUser.email}`, (done) => {
        loginAgent
            .post(loginUrl)
            .send(currentUser)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                done();
            });
    });

    it('should filter logined user post', (done) => {

        const postNum = _.filter(totalPost, item =>
            item.author.username === currentUser.email
        ).length;
        loginAgent
            .get(`${postUrl}?type=mine`)
            .end((err, res) => {
                if (err) { throw err; }
                res.body.code.should.equal(0);
                res.body.data.total.should.equal(postNum);
                done();
            });
    });

    for (let k = 0; k < 20; k += 1) {
        ((current) => {
            it('should filter post list by category', (done) => {
                const category = categoryList[current];
                const postNum = _.filter(totalPost,
                    item => item.category.name === category.name
                ).length;
                request(url)
                    .get(`${postUrl}?category=${category._id}`)
                    .end((err, res) => {
                        if (err) { throw err; }
                        res.body.code.should.equal(0);
                        res.body.data.total.should.equal(postNum);
                        done();
                    });
            });
            it('check category count', (done) => {
                const category = categoryList[current];
                const postNum = _.filter(totalPost,
                    item => item.category.name === category.name
                ).length;
                request(url)
                    .get(`${categoryUrl}/${category._id}`)
                    .end((err, res) => {
                        if (err) { throw err; }
                        res.body.code.should.equal(0);
                        res.body.data.count.should.equal(category.count + postNum);
                        done();
                    });
            });
        })(k);
    }
});
