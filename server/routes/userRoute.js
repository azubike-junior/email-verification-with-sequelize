import { Router } from 'express';
import UserController from '../controllers/User';
import { findUserById } from '../middlewares/checkUser';
import { validateInput } from '../middlewares/validations/validation';
import {verifyToken} from '../middlewares/authentication'

const userRoute = Router();

userRoute.post('/resetPassword', UserController.passwordResetRequest);
userRoute.put('/resetPassword/:token', UserController.resetPassword);
userRoute.get('/:userId', findUserById, verifyToken, UserController.getUserProfile);
userRoute.put('/:userId/updateProfile', validateInput, findUserById, verifyToken, UserController.updateUserProfile);

export default userRoute