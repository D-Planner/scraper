import { Router } from 'express';
import { requireAuth } from '../authentication/init';
import InterestsController from '../controllers/interests_controller';

const interestsRouter = Router();

interestsRouter.get('/', requireAuth, InterestsController.getInterests);
interestsRouter.post('/', requireAuth, InterestsController.seedInterests);
interestsRouter.post('/update', requireAuth, InterestsController.updateUserInterest);

export default interestsRouter;
