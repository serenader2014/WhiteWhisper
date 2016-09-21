import express from 'express';
import checkToken from '../middleware/check-token';
import checkOwner from '../middleware/check-owner';
import saveUser from '../middleware/save-user-to-request';
import controllers from '../controller';

// import brute           from '../middleware/brute';
// import checkPermission from '../middleware/check-permission';
// import checkId         from '../middleware/check-id';
const {
    authControllers,
    userControllers,
    postControllers,
    categoryControllers,
} = controllers;
const api = express();

api.use(saveUser());

api.route('/auth')
    .post(authControllers.auth);

api.route('/register')
    .post(authControllers.register);

api.route('/i')
    .all(checkToken())
    .get(userControllers.getMyself);

api.route('/users')
    .get(userControllers.list);

api.route('/users/:id')
    .all(checkToken())
    .get(userControllers.getUserInfo)
    .all(checkOwner())
    .put(userControllers.updateUserInfo);

api.route('/users/:id/password')
    .all(checkToken())
    .all(checkOwner())
    .post(userControllers.changePassword);

api.route('/posts')
    .get(postControllers.list)
    .all(checkToken())
    .post(postControllers.create);

// api.route('/post/:id')
//     .all(checkId())
//     .get(checkPermission('post', 'get'), apiController.post.getPost)
//     .put(checkPermission('post', 'put'), apiController.post.update)
//     .delete(checkPermission('post', 'delete'), apiController.post.delete);

api.route('/categories')
    .get(categoryControllers.list)
    .all(checkToken())
    .post(categoryControllers.create);

api.route('/categories/:id')
    .get(categoryControllers.info)
    .all(checkToken())
    .put(categoryControllers.update)
    .delete(categoryControllers.del);

// api.route('/captcha')
//     .get(apiController.captcha.generate)
//     .post(apiController.captcha.validate);

export default api;
