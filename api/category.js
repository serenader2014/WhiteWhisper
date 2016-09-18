import Category, { Categories } from '../model/category';
import _ from 'lodash';
import result from '../utils/result';
import generateSlug from '../utils/generate-slug';

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

export function list() {
    return Categories.forge().fetch();
}

export async function create(options, user) {
    const defaultOptions = {
        created_at: new Date(),
        created_by: user.id,
    };
    const category = _.extend({}, defaultOptions, options);
    category.slug = await generateSlug(category.name, 'category', false);
    return Category.create.bind(Category)(category);
}

export async function update(category, newCategory, currentUser) {
    const finalObject = _.pick(newCategory, ['name', 'image']);

    if (finalObject.name) {
        const isExist = await byName(finalObject.name);
        if (isExist) {
            return Promise.reject(result.category.nameTaken());
        }
        finalObject.slug = await generateSlug(finalObject.name, 'category', false);
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
