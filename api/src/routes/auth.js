import { Router } from 'express';
import * as UserController from '../controllers/user_controller';
import { requireSignin } from '../authentication/init';

const authRouter = Router();

authRouter.post('/signin', requireSignin, UserController.signin);
authRouter.post('/signup', UserController.signup);

export default authRouter;
