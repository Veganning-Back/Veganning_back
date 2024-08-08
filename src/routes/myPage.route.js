// myPage.route.js

import express from 'express';
import { myPageTest, myPageHandler,updateUser, savening_Recipe, savening_Restaurant } from '../controllers/myPage.controller.js';
export const myPageRouter = express.Router();

myPageRouter.get('/', myPageTest);

myPageRouter.get('/:id', myPageHandler);

myPageRouter.put('/:id/update', updateUser);

myPageRouter.get('/:id/savening_Recipe', savening_Recipe);
myPageRouter.get('/:id/savening_Restaurant', savening_Restaurant);