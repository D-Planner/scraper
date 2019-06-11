import { Router } from 'express';
import Professor from '../models/professor';
import ProfessorController from '../controllers/professors_controller';

const professorRouter = Router();


professorRouter.get('/', ProfessorController.getProfessors);

professorRouter.get('/:id', ProfessorController.getProfessorById);

export default professorRouter;
