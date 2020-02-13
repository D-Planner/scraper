import { Router } from 'express';
import { requireAuth } from '../authentication/init';
import ErrorController from '../controllers/error_controller';

const errorRouter = Router();

errorRouter.get('/', ErrorController.getErrors);
errorRouter.post('/', requireAuth, ErrorController.logError);

export default errorRouter;
