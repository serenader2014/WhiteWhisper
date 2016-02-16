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

describe('multiple user and post test', function () {
    var categoryList = [];

    var lt = require('./common/login')();
    lt.register();
    lt.login();
    var a = lt.agent;
    for (var o = 0; o < 20; o += 1) {
        (function (i) {
            var name = require('./common/login').randomString(6);
            it('create multiple category ' + name, function (done) {
                a
                    .post(categoryUrl)
                    .send({name: name})
                    .end(function (err, res) {
                        if (err) {throw err;}
                        res.body.code.should.equal(0);
                        res.body.data.name.should.equal(name);
                        categoryList.push(res.body.data);
                        done();
                    });
            });
        })(o);
    }
    lt.logout();

    var previousPostNumber = 0;

    it('should get current post list', function (done) {
        request(url)
            .get(postUrl)
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                previousPostNumber = res.body.data.total;
                done();
            });
    });

    var totalPost = [];
    var totalUser = [];
    for (var i = 0; i < 20; i += 1) {
        var loginTest    = require('./common/login')();
        var randomString = require('./common/login').randomString;
        totalUser.push(loginTest.randomUser);
        loginTest.register();
        loginTest.login();
        var agent        = loginTest.agent;
        (function (agent) {
            var count        = Math.floor(Math.random() * 5);
            for (var j = 0; j < count; j += 1) {
                it('create post', function (done) {
                    var category     = categoryList[Math.floor(Math.random() * categoryList.length)];
                    var p         = _.extend({}, post, {title: randomString(10), category: category._id});
                    agent
                        .post(postUrl)
                        .send(p)
                        .end(function (err, res) {
                            if (err) {throw err;}
                            res.body.code.should.equal(0);
                            totalPost.push(res.body.data);
                            done();
                        });
                });
            }
        })(agent);
        loginTest.logout();
    }

    it('should list the total post', function (done) {
        request(url)
            .get(postUrl)
            .end(function (err, res) {
                if (err) {throw err;}
                res.body.code.should.equal(0);
                res.body.data.total.should.equal(previousPostNumber + totalPost.length);
                done();
            });
    });

    for (var j = 0; j < totalUser.length; j += 1) {
        (function (current) {
            it('should filter post list by author', function (done) {
                var user = totalUser[current];
                var postNum = _.filter(totalPost, function (item) {return item.author.username === user.email; }).length;
                request(url)
                    .get(postUrl + '?author=' + user.email)
                    .end(function (err, res) {
                        if (err) {throw err;}
                        res.body.code.should.equal(0);
                        res.body.data.total.should.equal(postNum);
                        done();
                    });
            });
        })(j);
    }

    for (var k = 0; k < 20; k += 1) {
        (function (current) {
            it('should filter post list by category', function (done) {
                var category = categoryList[current];
                var postNum = _.filter(totalPost, function (item) {return item.category.name === category.name;}).length;
                request(url)
                    .get(postUrl + '?category=' + category.name)
                    .end(function (err, res) {
                        if (err) {throw err;}
                        res.body.code.should.equal(0);
                        res.body.data.total.should.equal(postNum);
                        done();
                    });
            });
            it('check category count', function (done) {
                var category = categoryList[current];
                var postNum = _.filter(totalPost, function (item) {return item.category.name === category.name;}).length;
                request(url)
                    .get(categoryUrl + '/' + category._id)
                    .end(function (err, res) {
                        if (err) {throw err;}
                        res.body.code.should.equal(0);
                        res.body.data.count.should.equal(category.count + postNum);
                        done();
                    });
            });
        })(k);
    }

});