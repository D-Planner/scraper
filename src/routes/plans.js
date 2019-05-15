import { Router } from 'express';
import PlanController from '../controllers/plan_controller';

const plansRouter = Router();

// GET /plans
plansRouter.get('/', (req, res, next) => {
    const userID = req.user.id;
    return PlanController.getPlansByUserId(userID).then((plans) => {
        res.json(plans);
    }).catch((err) => {
        next(err);
    });
});

// GET /plans/:id
plansRouter.get('/:id', (req, res, next) => {
    const planID = req.params.id;
    return PlanController.getPlanByID(planID).then((plan) => {
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

// DELETE /plans/:id
plansRouter.delete('/:id', (req, res, next) => {
    PlanController.deletePlanById(req.params.id).then((result) => {
        res.sendStatus(200);
    }).catch((err) => {
        if (err.name === 'CastError') {
            res.status(400).send({ message: 'The requested id was not valid ' });
        } else {
            next(err);
        }
    });
});

export default plansRouter;
