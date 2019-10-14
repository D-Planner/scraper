import { Router } from 'express';
import AnnouncementsController from '../controllers/announcements_controller';

const announcementsRouter = Router();

announcementsRouter.get('/', AnnouncementsController.getAnnouncements);

export default announcementsRouter;
