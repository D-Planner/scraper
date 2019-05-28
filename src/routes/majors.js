import { Router } from 'express';
import MajorController from '../controllers/major_controller';

const majorsRouter = Router();

majorsRouter.get('/', MajorController.getMajors);

majorsRouter.get('/declared', MajorController.getDeclared);

majorsRouter.post('/upload', MajorController.uploadMajor);

majorsRouter.route('/declared/:id')
    .get(MajorController.getMajor)
    .post(MajorController.declareMajor)
    .delete(MajorController.dropMajor);

majorsRouter.get('/progress/:id', MajorController.getProgress);

export default majorsRouter;
