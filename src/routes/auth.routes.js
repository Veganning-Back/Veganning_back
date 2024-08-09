import express from 'express';

import { registerUser } from '../controllers/auth.controller.js';
export const authRouter = express.Router();

authRouter.post('/join', registerUser);