import { Router } from 'express';
import UserCourseController from '../controllers/user_course_controller';

const userCourseRouter = Router();

userCourseRouter.post('/', UserCourseController.createUserCourse);

export default userCourseRouter;
