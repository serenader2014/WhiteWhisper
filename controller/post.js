import * as postApi from '../api/post';
import logger from '../utils/logger';

export function list(req, result, done) {
    (async () => {
        try {
            const posts = await postApi.list();
            done(posts);
        } catch (e) {
            done(e);
        }
    })();
}

export async function create(req, result, done) {
    const { slug } = req.body;
    req.checkBody('category', 'Invalid category id').notEmpty().isInt();
    const errors = req.validationErrors();

    if (errors) {
        return done(result.error.common.formInvalid(errors));
    }

    if (slug) {
        const isExist = await postApi.bySlug(slug);
        if (isExist) {
            return done(result.error.post.slugUsed(slug));
        }
    }

    try {
        const post = await postApi.create(req.body, req.user);
        return done(result(post));
    } catch (e) {
        logger.error(e);
        return done(result.error.common.serverError(e));
    }
}
