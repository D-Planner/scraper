import { Router } from 'express';
import DataController from '../controllers/data_controller';

const dataRouter = Router();

dataRouter.get('/ap', DataController.getAPPlacements);

export default dataRouter;
