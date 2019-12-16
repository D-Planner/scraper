import { Router } from 'express';
import advisorController from '../controllers/advisor_controller';

const advisorRouter = Router();

advisorRouter.post('/', advisorController.findOrCreateAdvisor);

export default advisorRouter;
