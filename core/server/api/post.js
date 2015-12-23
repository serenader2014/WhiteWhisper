import Post        from '../model/post';
import _           from 'lodash';
import get         from '../helper/get-data';
import categoryApi from './category';

export default {
    get () {
        return get.apply(Post, arguments);
    },
    create (options) {
        var post = new Post();
        _.extend(post, options);

        return post.saveAsync().spread((post) => {
            if (post.status === 'published') {
                return categoryApi.increaseCount(post.category.id).then(() => {
                    return post;
                });
            } else {
                return post;
            }
        });
    },
    update (id, options) {
        var obj = {};
        _.extend(obj, options);

        return Post.findByIdAsync(id).then((post) => {
            if (post.status === 'published' && obj.status !== 'published') {
                return categoryApi.decreaseCount(post.category.id);
            }
            if (post.status !== 'published' && obj.status === 'published') {
                return categoryApi.increaseCount(obj.category.id);
            }
            if (post.status === 'published' && obj.status === 'published' &&
                post.category.id.toString() !== obj.category.id.toString()) {
                return categoryApi.decreaseCount(post.category.id).then(() => {
                    return categoryApi.increaseCount(obj.category.id);
                });
            }
        }).then(() => {
            return Post.findByIdAndUpdateAsync(id, obj, {new: true});
        });
    },
    getById (id) {
        return this.get({_id: id});
    },
    getByAuthor (username, amount, page) {
        return this.get({'author.name': username}, amount, page);
    },
    getBySlug (slug) {
        return this.get({slug: slug}, 1, 1);
    },
    delete (id) {
        return this.update(id, {status: 'deleted'});
    }
};