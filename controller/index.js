import wrap from '../utils/response-wrapper';
import * as authControllers from './auth';
import * as categoryControllers from './category';
import * as postControllers from './post';
import * as userControllers from './user';

const controllerList = {
    authControllers,
    categoryControllers,
    postControllers,
    userControllers,
};

const map = {};

Object.keys(controllerList).forEach(key => {
    map[key] = {};
    const controllers = controllerList[key];
    Object.keys(controllers).forEach(controller => {
        /* eslint-disable no-param-reassign */
        map[key][controller] = wrap(controllers[controller]);
        // controller = response(controller);
    });
});

export default map;
