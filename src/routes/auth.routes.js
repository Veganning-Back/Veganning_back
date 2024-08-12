import express from 'express';

import { registerUser,loginUser } from '../controllers/auth.controller.js';
export const authRouter = express.Router();

authRouter.post('/join', registerUser);
authRouter.post('/login', loginUser);