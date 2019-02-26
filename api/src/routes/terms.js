import { Router } from 'express';
import TermController from '../controllers/term_controller';

const termsRouter = Router();

termsRouter.post('/terms', TermController.createTerm);
termsRouter.put('/terms/:id', TermController.updateTerm);

export default termsRouter;
