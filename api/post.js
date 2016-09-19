import Post from '../model/post';
import _ from 'lodash';
import Slug from '../utils/slug';
import config from '../config';
import marked from 'marked';

export const model = Post;

export function byId() {

}

export function bySlug() {

}

export function list() {

}

        // id: { type: increments, nullable: false, primary: true },
        // title: { type: str, nullable: false },
        // author: { type: int, nullable: false },
        // slug: { type: str, nullable: false, unique: true },
        // text: { type: text, nullable: true, fieldtype: 'medium' },
        // html: { type: text, nullable: true, fieldtype: 'medium' },
        // image: { type: text, nullable: true },
        // // 'published', 'unpublished', 'deleted', 'draft'
        // status: { type: str, nullable: false, defaultTo: 'draft' },
        // category: { type: int, nullable: false },
        // url: { type: str, nullable: false, unique: true },
        // createdAt: { type: dateTime, nullable: false },
        // createdBy: { type: int, nullable: false },
        // updatedAt: { type: dateTime, nullable: true },
        // updatedBy: { type: int, nullable: true },
        // publishedAt: { type: dateTime, nullable: true },
        // publishedBy: { type: int, nullable: true },
        // featured: { type: bool, nullable: false, defaultTo: false },


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

    const newPost = await Post.create.bind(Post)(post);
    return newPost;
}

export function update() {

}

export function del() {

}
