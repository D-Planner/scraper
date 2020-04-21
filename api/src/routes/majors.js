import { Router } from 'express';
import MajorController from '../controllers/major_controller';

const majorsRouter = Router();

majorsRouter.get('/', MajorController.getMajors);

majorsRouter.get('/declared', MajorController.getDeclared);

majorsRouter.post('/seed', MajorController.seedMajors);

majorsRouter.route('/declared/:id')
    .get(MajorController.getMajor)
    .post(MajorController.declareMajor)
    .delete(MajorController.dropMajor);

export default majorsRouter;
