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
        const isExist = await Category.checkIfExist({ name });
        if (isExist) {
            return res.json(result.category.nameTaken(name));
        }

        const category = await Category.create({
            name,
            slug: await generateSlug(name, 'category'),
        }, req.user);

        return res.json(result(category));
    })();
}
