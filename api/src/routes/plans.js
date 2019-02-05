import { Router } from 'express';
import PlanController from '../controllers/plan_controller';

const plansRouter = Router();

// GET /plans
plansRouter.get('/', (req, res) => {
    const userID = req.user.id;
    return PlanController.getPlansByUserId(userID).then((plans) => {
        res.json(plans);
    });
});

// POST /plans
plansRouter.post('/', (req, res, next) => {
    PlanController.createPlanForUser(req.body.plan, req.user.id).then((newPlan) => {
        res.send(PlanController.sortPlan(newPlan));
    }).catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
            res.status(409).send({ err, message: 'You have already created a plan with this name' });
        } else {
            next(err);
        }
    });
});

export default plansRouter;
