import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';
import { createHashHistory } from 'history';

import Login from './containers/Login/index.jsx';
import Home from './containers/Home/index.jsx';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

const store = configureStore(appHistory);
const history = syncHistoryWithStore(appHistory, store);

const routes = (
    <Router history={history}>
        <Route path="/" component={Home}>
            <IndexRoute component={Login} />
            <Route path="/login" component={Login} />
        </Route>
    </Router>
);

render(
    <Provider store={store} >
        {routes}
    </Provider>,
    document.querySelector('#app')
);
