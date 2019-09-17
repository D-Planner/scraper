import { Router } from 'express';
import GlobalsController from '../controllers/globals_controller';

const globalRouter = Router();

globalRouter.route('/')
    .get(GlobalsController.getGlobals)
    .post(GlobalsController.setGlobals);


export default globalRouter;
