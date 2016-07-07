import express from 'express';
import checkToken from '../middleware/check-token';
import checkOwner from '../middleware/check-owner';
import saveUser from '../middleware/save-user-to-request';
import * as authController from '../controller/auth';
import * as userController from '../controller/user';
// import brute           from '../middleware/brute';
// import checkPermission from '../middleware/check-permission';
// import checkId         from '../middleware/check-id';
const api = express();

api.use(saveUser());

api.route('/auth')
    .post(authController.auth);

api.route('/register')
    .post(authController.register);

api.route('/i')
    .all(checkToken())
    .get(userController.getMyself);

api.route('/user/:id')
    .all(checkToken())
    .get(userController.getUserInfo)
    .all(checkOwner())
    .put(userController.updateUserInfo);

api.route('/user/:id/password')
    .all(checkToken())
    .all(checkOwner())
    .post(userController.changePassword);

// api.route('/post')
//     .get(apiController.post.list)
//     .post(apiController.post.create);

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
