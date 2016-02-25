// import frontend from './frontend';
import api     from './api';
import express from 'express';
import { resolve }    from 'path';
let app         = express();


app.use('/api', api);
app.use('/admin', express.static(resolve(__dirname, '../../client')));
// app.use('/', frontend);

export default function () {
    return app;
}