import express from 'express';
import adminController from '../controller/admin';
let admin = express();

admin.route('*')
.get(adminController.getHomePage);

export default admin;