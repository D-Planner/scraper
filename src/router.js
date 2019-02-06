import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import * as CoursesController from './controllers/courses_controller';
import { requireSignin } from './authentication/init';

const router = Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the DPlanner API!' });
});

router.post('/signin', requireSignin, UserController.signin);

router.post('/signup', UserController.signup);

router.get('/courses', CoursesController.get);
router.get('/courses/seed', CoursesController.seed);

export default router;
