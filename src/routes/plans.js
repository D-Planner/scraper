import { Router } from 'express';
import { getPlansByUserId } from '../controllers/plan_controller';

const plansRouter = Router();

// GET /api/plans
plansRouter.get('/', (req, res) => {
    const userID = req.user._id;
    return getPlansByUserId(userID).then((plans) => {
        res.json(plans);
    });
});

export default plansRouter;
