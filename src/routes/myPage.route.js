// myPage.route.js

import express from 'express';
import { myPageTest, myPageHandler,updateUser } from '../controllers/myPage.controller.js';
export const myPageRouter = express.Router();

myPageRouter.get('/', myPageTest);

myPageRouter.get('/:id', myPageHandler);

myPageRouter.put('/:id/update', updateUser);
