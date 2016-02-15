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


    it('should update post', function (done) {
        var newPost = {
            title: 'new title',
            markdown: '## new title',
            html: '<h2>new title</h2>',
        };
        agent
            .put(postUrl)
            .send(_.extend(tmpPost, newPost))
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                res.body.data.title.should.equal(newPost.title);
                res.body.data.markdown.should.equal(newPost.markdown);
                res.body.data.html.should.equal(newPost.html);
                done();
            });
    });


});