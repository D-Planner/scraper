import { Router } from 'express';
import advisorController from '../controllers/advisor_controller';

const advisorRouter = Router();

advisorRouter.post('/', advisorController.findOrCreateAdvisor);
advisorRouter.get('/:id', advisorController.getAdvisor);

export default advisorRouter;
