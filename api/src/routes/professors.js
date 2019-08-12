import { Router } from 'express';
import ProfessorController from '../controllers/professors_controller';

const professorRouter = Router();

/**
 * @api {get} /professors/ Get all Professors in the DB
 * @apiName GetProfessors
 * @apiGroup Professors
 *
 * @apiSuccess {Array} Professors in the DB
 *
 */
professorRouter.get('/', ProfessorController.getProfessors);

/**
 * @api {get} /professors/ Get Professor By ID
 * @apiName GetProfessorsByID
 * @apiGroup Professors
 *
 * @apiSuccess {Array} Professor with specific ID
 *
 */
professorRouter.get('/:id', ProfessorController.getProfessorById);

export default professorRouter;
