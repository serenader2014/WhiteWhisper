import * as categoryApi from '../api/category';
import result from '../utils/result';
import logger from '../utils/logger';

export function list() {

}

export async function create(req, res) {
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

    try {
        const isExist = await categoryApi.checkIfExist({ name });
        if (isExist) {
            return res.json(result.category.nameTaken(name));
        }

        const category = await categoryApi.create({ name }, req.user);

        return res.json(result(category));
    } catch (e) {
        return res.json(result.common.serverError(e));
    }
}

export async function update(req, res) {
    const { id } = req.params;

    try {
        const category = await categoryApi.byId(id);

        if (!category) {
            return res.json(result.category.notFound(id));
        }

        try {
            const newCategory = await categoryApi.update(category, req.body, req.user);

            return res.json(result(newCategory));
        } catch (e) {
            return res.json(e);
        }
    } catch (e) {
        logger.error(e);
        return res.json(result.common.serverError(e));
    }
}

export async function info(req, res) {
    const { id } = req.params;

    try {
        const category = await categoryApi.byId(id);

        if (!category) {
            return res.json(result.category.notFound(id));
        }
        return res.json(result(category));
    } catch (e) {
        logger.error(e);
        return res.json(result.common.serverError(e));
    }
}

export async function del(req, res) {
    const { id } = req.params;

    try {
        const isSuccess = await categoryApi.del(id);
        if (!isSuccess) {
            return res.json(result.category.notFound(id));
        }
        return res.json(result());
    } catch (e) {
        logger.error(e);
        return res.json(result.common.serverError(e));
    }
}
