import Post from '../model/post';
import _ from 'lodash';

export default {
    model: Post,
    list() {
        return Post.query({});
    },
    create(options) {
        const defaultOptions = {
            title: 'Untitled',
            text: '',
            html: '',
            image: '',
            // 'published', 'unpublished', 'deleted', 'draft'
            status: 'draft',
            createdAt: new Date(),
            createdBy: 0,
            featured: false,
        };
        const post = _.extend({}, defaultOptions, options);

        return Post.create(post);
    },
    bySlug(slug) {
        return Post.query({ slug });
    },
};
