import { Router } from 'express';
import { requireAuth } from '../authentication/init';
import InterestsController from '../controllers/interests_controller';

const interestsRouter = Router();

interestsRouter.get('/', requireAuth, InterestsController.getInterests);

export default interestsRouter;
