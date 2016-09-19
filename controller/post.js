import * as postApi from '../api/post';
import result from '../utils/result';
import logger from '../utils/logger';

export function list(req, res) {
    (async () => {
        try {
            const posts = await postApi.list();
            res.json(posts);
        } catch (e) {
            res.json(e);
        }
    })();
}

export async function create(req, res) {
    const { slug } = req.body;

    req.checkBody('category', 'Invalid category id').notEmpty().isInt();
    const errors = req.validationErrors();

    if (errors) {
        return res.json(result.common.formInvalid(errors));
    }

    if (slug) {
        const isExist = await postApi.bySlug(slug);
        if (isExist) {
            return res.json(result.post.slugTaken(slug));
        }
    }

    try {
        const post = await postApi.create(req.body, req.user);

        return res.json(result(post));
    } catch (e) {
        logger.error(e);
        return res.json(result.common.serverError(e));
    }
}
