// import frontend from './frontend';
import api         from './api';
import express     from 'express';
import { resolve } from 'path';
const app         = express();


app.use('/api', api);
app.use('/admin', express.static(resolve(__dirname, '../../client/build')));
// app.use('/', frontend);

export default function () {
    return app;
}
