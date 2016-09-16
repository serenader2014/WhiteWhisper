import Category from '../model/category';
import _ from 'lodash';

export default {
    model: Category,
    create(options, user) {
        const defaultOptions = {
            created_at: new Date(),
            created_by: user.id,
        };
        const category = _.extend({}, defaultOptions, options);
        return Category.create.bind(Category)(category);
    },
    bySlug(slug) {
        return Category.query({ slug });
    },
    byName(name) {
        return Category.query({ name });
    },
    checkIfExist: Category.checkIfExist.bind(Category),
};
