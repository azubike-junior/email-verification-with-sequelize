import { Router } from 'express';
import authRouter from './authRoute'
import userRouter from './userRoute'

const mainAppRouter = Router();

mainAppRouter.use('/auth', authRouter)
mainAppRouter.use('/user', userRouter)

export default mainAppRouter;