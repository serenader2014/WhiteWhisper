import 'should';
import request from 'supertest';
import { appUrl, postUrl, createUser, createCategory } from './utils';
import marked from 'marked';

const markdown = `
Link Markdown Example

This is a paragraph that contains a [link to ghost](http://ghost.org).
List Markdown Example

This paragraph contains a list of items.

* Item 1
* Item 2
* Item three
Quote Markdown Example

This paragraph has a quote

> That is pulled out like this

from the text my post.
`;

describe('Post test', () => {
    let post;
    let user;

    it('should create a new post', async () => {
        user = await createUser();
        const category = await createCategory(user.token);
        post = {
            title: 'Markdown 教程',
            text: markdown,
            category: category.id,
            status: 'draft',
            featured: false,
        };

        return new Promise(resolve => {
            request(appUrl)
                .post(`${postUrl}?token=${user.token}`)
                .send(post)
                .end((err, res) => {
                    if (err) throw err;
                    res.body.code.should.equal(0);
                    res.body.data.title.should.equal(post.title);
                    res.body.data.html.should.equal(marked(markdown));
                    post.id = res.body.data.id;
                    resolve();
                });
        });
    });

    it('Should get post info', done => {
        request(appUrl)
            .get(`${postUrl}/${post.id}?token=${user.token}`)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                res.body.data.title.should.equal(post.title);
                done();
            });
    });

    it('Should list the posts', done => {
        request(appUrl)
            .get(`${postUrl}`)
            .end((err, res) => {
                if (err) throw err;
                res.body.code.should.equal(0);
                done();
            });
    });
});
