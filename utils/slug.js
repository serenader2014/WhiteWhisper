import unidecode from 'unidecode';
import * as User from '../api/user';
import * as Post from '../api/post';
import * as Category from '../api/category';
import crypto from 'crypto';

export default class Slug {
    constructor(type, hasHash) {
        this.hasHash = hasHash;
        this.type = type;
    }

    checkIfExist(slug) {
        return (async () => {
            switch (this.type) {
                case 'user':
                    return await User.bySlug(slug);
                case 'post':
                    return await Post.bySlug(slug);
                case 'category':
                    return await Category.bySlug(slug);
                default:
                    return Promise.reject(`slug type must be either \`user\`
                     or \`post\` or \`category\``);
            }
        })();
    }

    generateHash(text) {
        const md5 = crypto.createHash('md5');
        md5.update(text);
        return md5.digest('hex');
    }

    generateUnidecode(text) {
        return unidecode(text)
            .toLowerCase()
            .replace(/(\s+)|(\W+)/g, '-')
            .replace(/(^-)|(-$)/, '');
    }

    digest(text, count) {
        return (async () => {
            let slug = this.generateUnidecode(text);
            const salt = new Date().getTime() + Math.floor(Math.random() * 10000);
            slug = this.hasHash ?
                `${slug}-${this.generateHash(slug + salt).substring(0, 8)}`
                : `${slug}${count ? `${-count}` : ''}`;
            const isExist = await this.checkIfExist(slug);

            const c = count ? count + 1 : 1;

            if (isExist) return this.digest(text, this.hasHash ? null : c);

            return slug;
        })();
    }
}
