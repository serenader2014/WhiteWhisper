import express from 'express';
import checkToken from '../middleware/check-token';
import checkOwner from '../middleware/check-owner';
import saveUser from '../middleware/save-user-to-request';
import * as authController from '../controller/auth';
import * as userController from '../controller/user';
import * as postController from '../controller/post';
import * as categoryController from '../controller/category';
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

api.route('/users')
    .get(userController.list);

api.route('/users/:id')
    .all(checkToken())
    .get(userController.getUserInfo)
    .all(checkOwner())
    .put(userController.updateUserInfo);

api.route('/users/:id/password')
    .all(checkToken())
    .all(checkOwner())
    .post(userController.changePassword);

api.route('/posts')
    .get(postController.list)
    .all(checkToken())
    .post(postController.create);

// api.route('/post/:id')
//     .all(checkId())
//     .get(checkPermission('post', 'get'), apiController.post.getPost)
//     .put(checkPermission('post', 'put'), apiController.post.update)
//     .delete(checkPermission('post', 'delete'), apiController.post.delete);

api.route('/categories')
    .get(categoryController.list)
    .all(checkToken())
    .post(categoryController.create);

api.route('/categories/:id')
    .get(categoryController.info)
    .all(checkToken())
    .put(categoryController.update)
    .delete(categoryController.del);

// api.route('/captcha')
//     .get(apiController.captcha.generate)
//     .post(apiController.captcha.validate);

export default api;
