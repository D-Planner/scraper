import { Router } from 'express';
import CoursesController from '../controllers/courses_controller';

const coursesRouter = Router();

coursesRouter.get('/', CoursesController.getCourses);

coursesRouter.get('/:id', CoursesController.getCourse);

coursesRouter.post('/search', CoursesController.getCourseByName);

coursesRouter.post('/create', CoursesController.createCourse);

coursesRouter.route('/favorites/:id')
    .post(CoursesController.addFavorite)
    .delete(CoursesController.removeFavorite);

coursesRouter.get('/departments/:department', CoursesController.getCoursesByDepartment);

coursesRouter.get('/distribs/:distrib', CoursesController.getCoursesByDistrib);

coursesRouter.get('/wcs/:wc', CoursesController.getCoursesByWC);

export default coursesRouter;
