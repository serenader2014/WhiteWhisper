import admin    from './admin';
import frontend from './frontend';
import api      from './api';
import express  from 'express';
let app      = express();


app.use('/api', api);
app.use('/admin', admin);
app.use('/', frontend);

export default function () {
    return app;
}