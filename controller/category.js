import * as categoryApi from '../api/category';
import logger from '../utils/logger';

export async function list(req, result, done) {
    let { pageSize, page } = req.query;
    const queryObject = {};

    pageSize = parseInt(pageSize, 10);
    page = parseInt(page, 10);

    if (!isNaN(pageSize)) {
        queryObject.pageSize = pageSize;
    }

    if (!isNaN(page)) {
        queryObject.page = page;
    }

    try {
        const categories = await categoryApi.list(queryObject);
        return done(result(categories));
    } catch (e) {
        logger.error(e);
        return (result.error.common.serverError(e));
    }
}

export async function create(req, result, done) {
    const { name } = req.body;

    req.checkBody({
        name: {
            notEmpty: true,
        },
    });

    const errors = req.validationErrors();

    if (errors) {
        return done(result.error.common.formInvalid(errors));
    }

    try {
        const isExist = await categoryApi.checkIfExist({ name });
        if (isExist) {
            return done(result.error.category.nameUsed(name));
        }

        const category = await categoryApi.create({ name }, req.user);

        return done(result(category));
    } catch (e) {
        return done(result.error.common.serverError(e));
    }
}

export async function update(req, result, done) {
    const { id } = req.params;

    try {
        const category = await categoryApi.byId(id);

        if (!category) {
            return done(result.error.category.notFound(id));
        }

        try {
            const newCategory = await categoryApi.update(category, req.body, req.user);

            return done(result(newCategory));
        } catch (e) {
            return done(e);
        }
    } catch (e) {
        logger.error(e);
        return done(result.error.common.serverError(e));
    }
}

export async function info(req, result, done) {
    const { id } = req.params;

    try {
        const category = await categoryApi.byId(id);

        if (!category) {
            return done(result.error.category.notFound(id));
        }
        return done(result(category));
    } catch (e) {
        logger.error(e);
        return done(result.error.common.serverError(e));
    }
}

export async function del(req, result, done) {
    const { id } = req.params;

    try {
        const isSuccess = await categoryApi.del(id);
        if (!isSuccess) {
            return done(result.error.category.notFound(id));
        }
        return done(result());
    } catch (e) {
        logger.error(e);
        return done(result.error.common.serverError(e));
    }
}
