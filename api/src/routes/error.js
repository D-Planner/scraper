import { Router } from 'express';
import ErrorController from '../controllers/error_controller';

const errorRouter = Router();

errorRouter.get('/', ErrorController.getErrors);
errorRouter.post('/', ErrorController.logError);

export default errorRouter;
