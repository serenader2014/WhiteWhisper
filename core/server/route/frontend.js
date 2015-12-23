import express            from 'express';
import homePageController from '../controller/frontend';
let frontend = express();

frontend.route('/')
.get(homePageController.getHomePage);

export default frontend;