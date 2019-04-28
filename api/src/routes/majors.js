import { Router } from 'express';
import MajorController from '../controllers/major_controller';

const majorsRouter = Router();

majorsRouter.get('/', MajorController.getMajors);

majorsRouter.post('/upload', MajorController.uploadMajor);

export default majorsRouter;
