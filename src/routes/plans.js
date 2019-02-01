import { Router } from 'express';
import PlanController from '../controllers/plan_controller';
import Term from '../models/term';

const plansRouter = Router();

// GET /plans
plansRouter.get('/', (req, res) => {
    const userID = req.user.id;
    return PlanController.getPlansByUserId(userID).then((plans) => {
        res.json(plans);
    });
});

// POST /plans
plansRouter.post('/', (req, res) => {
    PlanController.createPlanForUser(req.body.plan, req.user.id).then((newPlan) => {
        newPlan.terms.forEach((val, key, map) => {
            // TODO Populate plan
            console.log('YEET:', val);
        });
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

export default plansRouter;
