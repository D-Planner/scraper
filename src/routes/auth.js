import { Router } from 'express';
import * as UserController from '../controllers/user_controller';
import { requireSignin, requireAuth } from '../authentication/init';

const authRouter = Router();

authRouter.post('/signin', requireSignin, UserController.signin);
authRouter.post('/signup', UserController.signup);
authRouter.get('/:id', requireAuth, UserController.getUser);

export default authRouter;
