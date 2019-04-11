import { Router } from 'express';
import CoursesController from '../controllers/courses_controller';

const coursesRouter = Router();

coursesRouter.post('/search', CoursesController.getCourseByName);

coursesRouter.post('/create', CoursesController.createCourse);

coursesRouter.get('/favorite', CoursesController.getFavorite);

coursesRouter.route('/favorite/:id')
    .post(CoursesController.addFavorite)
    .delete(CoursesController.removeFavorite);

coursesRouter.route('/completed/:id')
    .get(CoursesController.getCompleted)
    .post(CoursesController.addCompleted)
    .delete(CoursesController.removeCompleted);

coursesRouter.get('/:department&:number', CoursesController.getCourseByTitle);

coursesRouter.get('/departments/:department', CoursesController.getCoursesByDepartment);

coursesRouter.get('/distribs/:distrib', CoursesController.getCoursesByDistrib);

coursesRouter.get('/wcs/:wc', CoursesController.getCoursesByWC);

coursesRouter.get('/:id', CoursesController.getCourse);

coursesRouter.get('/', CoursesController.getCourses);


export default coursesRouter;
