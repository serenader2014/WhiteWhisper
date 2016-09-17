import Category from '../api/category';
import result from '../utils/result';
import generateSlug from '../utils/generate-slug';

export function list() {

}

export function create(req, res) {
    const { name } = req.body;

    req.checkBody({
        name: {
            notEmpty: true,
        },
    });

    const errors = req.validationErrors();

    if (errors) {
        return res.json(result.common.formInvalid(errors));
    }

    return (async () => {
        try {
            const isExist = await Category.checkIfExist({ name });
            if (isExist) {
                return res.json(result.category.nameTaken(name));
            }

            const category = await Category.create({
                name,
                slug: await generateSlug(name, 'category'),
            }, req.user);

            return res.json(result(category));
        } catch (e) {
            return res.json(result.common.serverError(e));
        }
    })();
}

export function update(req, res) {
    const { name } = req.body;

}

export function info(req, res) {
    const { id } = req.params;

    return (async () => {
        try {
            const category = await Category.byId(id);

            if (!category) {
                return res.json(result.category.notFound(id));
            }
            return res.json(result(category));
        } catch (e) {
            return res.json(result.common.serverError(e));
        }
    })();
}

export function del() {

}
