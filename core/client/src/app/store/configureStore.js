import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';
import { routerMiddleware } from 'react-router-redux';

let middlewares = [thunk];

export default (history, initialState) => {
    middlewares = [...middlewares, routerMiddleware];
    const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
    return createStoreWithMiddleware(reducers, initialState);
};
