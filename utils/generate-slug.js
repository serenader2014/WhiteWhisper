import unidecode from 'unidecode';
import User from '../api/user';
import Post from '../api/post';
import Category from '../api/category';
import crypto from 'crypto';

export default async function (text, type) {
    const originalSlug = unidecode(text)
        .toLowerCase()
        .replace(/(\s+)|(\W+)/g, '-')
        .replace(/(^-)|(-$)/, '');

    const md5 = crypto.createHash('md5');
    md5.update(originalSlug + new Date().getTime().toString());
    const slugHash = md5.digest('hex');

    let slug = `${originalSlug}-${slugHash.substring(0, 5)}`;

    let isSlugUsed;

    switch (type) {
        case 'user':
            isSlugUsed = await User.bySlug(slug);
            break;
        case 'post':
            isSlugUsed = await Post.bySlug(slug);
            break;
        case 'category':
            isSlugUsed = await Category.bySlug(slug);
            break;
        default:
            return Promise.reject('slug type must be either `user` or `post` or `category`');
    }

    if (isSlugUsed) {
        const newMd5 = crypto.createHash('md5');
        const num = new Date().getTime() + Math.floor(Math.randomo() * 1000);
        newMd5.update(originalSlug + num.toString());
        const newSlugHash = newMd5.digest('hex');
        slug = `${originalSlug}-${newSlugHash.substring(0, 5)}`;
    }

    return slug;
};
