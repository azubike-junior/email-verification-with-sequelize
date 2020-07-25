import {Router} from 'express';
import UserController from '../controllers/User';
import { validateInput } from '../middlewares/validations/validation';
import { checkUniqueEmail } from '../middlewares/checkUser';

const authRouter = Router()

authRouter.post('/signin', validateInput, UserController.userLogin);
authRouter.post('/signup', validateInput, checkUniqueEmail,  UserController.signUpUser);
authRouter.get('/verification/:token', UserController.verifyUserAccount);

export default authRouter;