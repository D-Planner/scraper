import { Router } from 'express';
import CoursesController from '../controllers/courses_controller';

const coursesRouter = Router();

coursesRouter.get('/', CoursesController.getCourses);

coursesRouter.post('/create', CoursesController.createCourse);

coursesRouter.get('/departments/:department', CoursesController.getCoursesByDepartment);

coursesRouter.get('/distribs/:distrib', CoursesController.getCoursesByDistrib);

coursesRouter.get('/wcs/:wc', CoursesController.getCoursesByWC);

export default coursesRouter;
