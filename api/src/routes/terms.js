import { Router } from 'express';
import TermController from '../controllers/term_controller';

const termsRouter = Router();

// I don't think I want to expose the ability to create terms to the frontend
// The createTerm functionality should really only be used by the plans controller
// termsRouter.post('/', TermController.createTerm);

termsRouter.route('/:termID/course')
    .post(TermController.addCourseToTerm)
    .delete(TermController.removeCourseFromTerm);

termsRouter.put('/:id', TermController.updateTerm);

export default termsRouter;
