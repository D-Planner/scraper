import { Router } from 'express';
import AnnouncementsController from '../controllers/announcements_controller';

const announcementsRouter = Router();

announcementsRouter.route('/')
    .get(AnnouncementsController.getCurrentAnnouncement)
    .post(AnnouncementsController.newAnnouncement)
    .delete(AnnouncementsController.deleteAllAnnouncements);
announcementsRouter.route('/:id')
    .get(AnnouncementsController.getAnnouncement)
    .post(AnnouncementsController.updateAnnouncement)
    .delete(AnnouncementsController.deleteAnnouncement);

export default announcementsRouter;
