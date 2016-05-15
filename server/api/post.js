import Post        from '../model/post';
import _           from 'lodash';
import get         from '../helper/get-data';
import categoryApi from './category';

export default {
    get(...args) {
        return get.apply(Post, args);
    },
    create(options) {
        const post = new Post();
        _.extend(post, options);
        return post.save().then(currentPost => {
            if (currentPost.status === 'published') {
                /* eslint-disable no-underscore-dangle */
                return categoryApi.increaseCount(currentPost.category._id).then(() => currentPost);
            }
            return currentPost;
        });
    },
    update(id, options) {
        const obj = {};
        _.extend(obj, options);

        /* eslint-disable consistent-return */
        return Post.findByIdAsync(id).then((post) => {
            if (post.status === 'published' && obj.status !== 'published') {
                return categoryApi.decreaseCount(post.category._id);
            }
            if (post.status !== 'published' && obj.status === 'published') {
                return categoryApi.increaseCount(obj.category._id);
            }
            if (post.status === 'published' && obj.status === 'published' &&
                post.category._id.toString() !== obj.category._id.toString()) {
                return categoryApi.decreaseCount(post.category._id)
                    .then(() => categoryApi.increaseCount(obj.category._id));
            }
        }).then(() => Post.findByIdAndUpdateAsync(id, obj, { new: true }));
    },
    getById(id) {
        return this.get({ _id: id });
    },
    getByAuthor(username, amount, page) {
        return this.get({ 'author.name': username }, amount, page);
    },
    getBySlug(slug) {
        return this.get({ slug }, 1, 1);
    },
    delete(id) {
        return this.update(id, { status: 'deleted' });
    },
};
