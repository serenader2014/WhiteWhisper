import express from 'express';
import jwt from 'jsonwebtoken';
import apiController from '../controller/api';
// import brute           from '../middleware/brute';
// import checkPermission from '../middleware/check-permission';
// import checkId         from '../middleware/check-id';
const api = express();


api.route('/auth')
    .post(apiController.auth);

api.route('/register')
    .post(apiController.register);

api.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            /* eslint-disable no-param-reassign */
            req.user = decoded;
            next();
        });
    }
});

api.route('/i')
    .get(apiController.getUserInfo);

// api.route('/post')
//     .get(checkPermission('post', 'get'), apiController.post.list)
//     .post(checkPermission('post', 'post'), apiController.post.create);

// api.route('/post/:id')
//     .all(checkId())
//     .get(checkPermission('post', 'get'), apiController.post.getPost)
//     .put(checkPermission('post', 'put'), apiController.post.update)
//     .delete(checkPermission('post', 'delete'), apiController.post.delete);

// api.route('/category')
//     .get(checkPermission('category', 'get'), apiController.category.list)
//     .post(checkPermission('category', 'post'), apiController.category.create);

// api.route('/category/:id')
//     .all(checkId())
//     .get(checkPermission('category', 'get'), apiController.category.getCategory)
//     .put(checkPermission('category', 'put'), apiController.category.update)
//     .delete(checkPermission('category', 'delete'), apiController.category.delete);

// api.route('/captcha')
//     .get(apiController.captcha.generate)
//     .post(apiController.captcha.validate);

export default api;
