/* jshint mocha:true */

require('should');
var request     = require('supertest');
var _           = require('lodash');
var loginTest   = require('./common/login')();
var url         = 'http://localhost:10011';
var postUrl     = '/api/post';
var categoryUrl = '/api/category';
var post        = {
    title   : 'test title',
    slug    : 'test title slug',
    markdown: '# test markdown',
    html    : '<h1>test markdown</h1>',
    tags    : 'tags, tags',
    status  : 'published',
};
var newPost = {
    title   : 'new title',
    markdown: '## new title',
    html    : '<h2>new title</h2>',
};
describe('create account', function () {
    loginTest.register();
    loginTest.login();
    var agent = loginTest.agent;


    it('should list post', function (done) {
        agent
            .get(postUrl)
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                res.body.data.total.should.equal(0);
                done();
            });
    });


    var category;
    it('should get the a category', function (done) {
        agent
            .get(categoryUrl)
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                category = res.body.data.data[0];
                done();
            });
    });

    it('should create new post', function (done) {
        agent
            .post(postUrl)
            .send(_.extend(post, {category: category._id}))
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                done();
            });
    });

    it('should increase the category post count', function (done) {
        agent
            .get(categoryUrl + '/' + category._id)
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                res.body.data.count.should.equal(category.count + 1);
                done();
            });
    });


    var tmpPost;
    it('should list post', function (done) {
        agent
            .get(postUrl)
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                res.body.data.total.should.equal(1);
                res.body.data.data[0].title.should.equal(post.title);
                tmpPost = res.body.data.data[0];
                done();
            });
    });

    it('should get single post', function (done) {
        agent
            .get(postUrl + '/' + tmpPost._id)
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                res.body.data.title.should.equal(tmpPost.title);
                done();
            });
    });

    it('should update post', function (done) {
        agent
            .put(postUrl + '/' + tmpPost._id)
            .send(_.extend({}, tmpPost, newPost))
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                res.body.data.title.should.equal(newPost.title);
                res.body.data.markdown.should.equal(newPost.markdown);
                res.body.data.html.should.equal(newPost.html);
                done();
            });
    });

    it('should get post history', function (done) {
        agent
            .get(postUrl + '/' + tmpPost._id + '?history=true')
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                res.body.data.total.should.equal(1);
                res.body.data.data[0].title.should.equal(tmpPost.title);
                done();
            });
    });

    it('should not show the history in the post list', function (done) {
        agent
            .get(postUrl)
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                res.body.data.total.should.equal(1);
                done();
            });
    });

    it('should save a post draft', function (done) {
        agent
            .put(postUrl + '/' + tmpPost._id)
            .send(_.extend({}, tmpPost, newPost, {status: 'draft'}))
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                done();
            });
    });

    it('should have two post history now', function (done) {
        agent
            .get(postUrl + '/' + tmpPost._id + '?history=true')
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                res.body.data.total.should.equal(2);
                res.body.data.data[0].status.should.equal('draft');
                done();
            });
    });

    it('should not change the previous post content', function (done) {
        agent
            .get(postUrl + '/' + tmpPost._id)
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                res.body.data.status.should.equal(tmpPost.status);
                done();
            });
    });

    it('should reject the guest to view the post history', function (done) {
        request(url)
            .get(postUrl + '/' + tmpPost._id + '?history=true')
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(-1);
                done(); 
            });
    });
});