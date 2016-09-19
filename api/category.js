import Category from '../model/category';
import _ from 'lodash';
import result from '../utils/result';
import Slug from '../utils/slug';
import Pagination from '../db/pagination';

export const model = Category;

export function bySlug(slug) {
    return Category.query({ slug });
}

export function byName(name) {
    return Category.query({ name });
}

export function byId(id) {
    return Category.query({ id });
}

export function list(...args) {
    return new Pagination(Category).list(...args);
}

export async function create(options, user) {
    const defaultOptions = {
        created_at: new Date(),
        created_by: user.id,
    };
    const category = _.extend({}, defaultOptions, options);
    category.slug = await new Slug('category', false).digest(category.name);
    return Category.create(category);
}

export async function update(category, newCategory, currentUser) {
    const finalObject = _.pick(newCategory, ['name', 'image']);

    if (finalObject.name) {
        const isExist = await byName(finalObject.name);
        if (isExist) {
            return Promise.reject(result.category.nameTaken());
        }
        finalObject.slug = await new Slug('category', false).digest(finalObject.name);
    }

    finalObject.updated_at = new Date();
    finalObject.updated_by = currentUser.id;

    for (const i of Object.keys(finalObject)) {
        category.set(i, finalObject[i]);
    }

    return category.save();
}

export async function del(id) {
    const target = await byId(id);

    if (!target) {
        return false;
    }

    await target.destroy();
    return true;
}

export const checkIfExist = Category.checkIfExist.bind(Category);
