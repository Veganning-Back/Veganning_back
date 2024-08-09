// myPage.route.js

import express from 'express';
import { myPageTest, myPageHandler,updateUser, savening_Recipe, savening_Restaurant, deleteSavedRecipe, deleteSavedRestaurant } from '../controllers/myPage.controller.js';
export const myPageRouter = express.Router();

myPageRouter.get('/', myPageTest);

myPageRouter.get('/:id', myPageHandler);

myPageRouter.put('/:id/update', updateUser);

myPageRouter.get('/:id/savening_Recipe', savening_Recipe);
myPageRouter.get('/:id/savening_Restaurant', savening_Restaurant);
myPageRouter.delete('/:id/savening_Recipe/:recipeId', deleteSavedRecipe);
myPageRouter.delete('/:id/savening_Restaurant/:storeId', deleteSavedRestaurant);