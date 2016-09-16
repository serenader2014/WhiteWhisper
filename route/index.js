// import frontend from './frontend';
import api from './api';
import express from 'express';
const app = express();

app.use('/api', api);
// app.use('/admin', express.static(resolve(__dirname, '../../client/build')));
// app.use('/', frontend);

app.get('/', (req, res) => {
    res.status(200).send('ok');
});

export default function () {
    return app;
}
