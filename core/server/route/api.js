import express         from 'express';
import apiController   from '../controller/api';
import brute           from '../middleware/brute';
import checkPermission from '../middleware/check-permission';
let api                = express();

api.route('/login')
    .post(/*brute({
        limitCount: 5,
        limitTime: 60*60*1000,
        minWaitTime: 100*1000,
    }), */apiController.login);

api.route('/register')
    .post(apiController.register);

api.route('/logout')
    .all(apiController.logout);

api.route('/user')
    .get(apiController.user.getInfo);

api.route('/post')
    .get(checkPermission('post', 'get'), apiController.post.list)
    .post(checkPermission('post', 'post'), apiController.post.create);

api.route('/post/:id')
    .get(checkPermission('post', 'get'), apiController.post.getPost)
    .put(checkPermission('post', 'put'), apiController.post.update)
    .delete(checkPermission('post', 'delete'), apiController.post.delete);

api.route('/category')
    .get(checkPermission('category', 'get') ,apiController.category.list)
    .post(checkPermission('category', 'post'), apiController.category.create);

api.route('/category/:id')
    .get(checkPermission('category', 'get'), apiController.category.getCategory)
    .put(checkPermission('category', 'put'), apiController.category.update)
    .delete(checkPermission('category', 'delete'), apiController.category.delete);

export default api;