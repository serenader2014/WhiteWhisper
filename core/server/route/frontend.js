import express            from 'express';
import homePageController from '../controller/frontend';
const frontend = express();

frontend.route('/')
.get(homePageController.getHomePage);

export default frontend;
