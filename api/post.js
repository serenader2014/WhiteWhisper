import Post from '../model/post';
import _ from 'lodash';
import Slug from '../utils/slug';
import config from '../config';
import marked from 'marked';
import Pagination from '../db/pagination';

const postPagination = new Pagination(Post);

export const model = Post;

export function byId(id) {
    return Post.query({ id }, { withRelated: ['author', 'category'] });
}

export function bySlug(slug) {
    return Post.query({ slug }, { withRelated: ['author', 'category'] });
}

export function list(queryObject, user) {
    return postPagination.list(queryObject, user, {
        withRelated: ['author', 'category'],
    });
}

export async function create(options, user) {
    const defaultOptions = {
        title: 'Untitled',
        author: user.id,
        text: '',
        status: 'draft',
        created_at: new Date(),
        created_by: user.id,
        featured: false,
    };

    const post = _.extend({}, defaultOptions, _.pick(options, [
        'title', 'text', 'image', 'status', 'category', 'featured',
    ]));
    const currentConfig = config[config.env];
    const baseURL = `${currentConfig.host}:${currentConfig.port}`;
    post.slug = await new Slug('post', true).digest(post.title);
    post.url = `${currentConfig.protocol}${baseURL}/post/${post.slug}`;
    post.html = marked(post.text);

    if (post.status === 'published') {
        post.published_at = new Date();
        post.published_by = user.id;
    }

    const newPost = await Post.create(post);
    return newPost;
}

export function update() {

}

export function del() {

}
