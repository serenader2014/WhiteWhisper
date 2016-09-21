import express from 'express';
import checkToken from '../middleware/check-token';
import checkOwner from '../middleware/check-owner';
import saveUser from '../middleware/save-user-to-request';
import methodNotAllowed from '../middleware/method-not-allowed';
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
api.options('*', (req, res) => res.send('ok'));

api.route('/auth')
    .post(authControllers.auth)
    .all(methodNotAllowed(['POST']));

api.route('/register')
    .post(authControllers.register)
    .all(methodNotAllowed(['POST']));

api.route('/i')
    .all(checkToken())
    .get(userControllers.getMyself)
    .all(methodNotAllowed(['GET']));

api.route('/users')
    .get(userControllers.list)
    .all(methodNotAllowed(['GET']));

api.route('/users/:id')
    .all(checkToken())
    .get(userControllers.getUserInfo)
    .all(checkOwner())
    .put(userControllers.updateUserInfo)
    .patch(userControllers.updateUserInfo)
    .all(methodNotAllowed(['GET', 'PUT', 'PATCH']));

api.route('/users/:id/password')
    .all(checkToken())
    .all(checkOwner())
    .post(userControllers.changePassword)
    .all(methodNotAllowed(['POST']));

api.route('/posts')
    .get(postControllers.list)
    .all(checkToken())
    .post(postControllers.create)
    .all(methodNotAllowed(['GET', 'POST']));

// api.route('/post/:id')
//     .all(checkId())
//     .get(checkPermission('post', 'get'), apiController.post.getPost)
//     .put(checkPermission('post', 'put'), apiController.post.update)
//     .delete(checkPermission('post', 'delete'), apiController.post.delete);

api.route('/categories')
    .get(categoryControllers.list)
    .all(checkToken())
    .post(categoryControllers.create)
    .all(methodNotAllowed(['GET', 'POST']));

api.route('/categories/:id')
    .get(categoryControllers.info)
    .all(checkToken())
    .put(categoryControllers.update)
    .patch(categoryControllers.update)
    .delete(categoryControllers.del)
    .all(methodNotAllowed(['GET', 'PUT', 'DELETE', 'PATCH']));

// api.route('/captcha')
//     .get(apiController.captcha.generate)
//     .post(apiController.captcha.validate);

export default api;
