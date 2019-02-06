import { Router } from 'express';
import PlanController from '../controllers/plan_controller';

const plansRouter = Router();

// GET /plans
plansRouter.get('/', (req, res, next) => {
    const userID = req.user.id;
    return PlanController.getPlansByUserId(userID).then((plans) => {
        res.json({ plans });
    }).catch((err) => {
        next(err);
    });
});

plansRouter.get('/:name', (req, res, next) => {
    const userID = req.user.id;
    const planName = req.params.name;
    return PlanController.getPlanByUserAndPlanName(userID, planName).then((plan) => {
        res.json(plan);
    }).catch((err) => {
        next(err);
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
