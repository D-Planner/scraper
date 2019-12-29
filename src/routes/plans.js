import { Router } from 'express';
import PlanController from '../controllers/plan_controller';
import { emptyPlan } from '../../static/emptyplan';

const plansRouter = Router();

/**
 * @api {get} /plans/ Get all plans for a user
 * @apiName GetPlans
 * @apiGroup Plans
 *
 * @apiSuccess {Array} plans the list of a user's plans
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      [
 *          {
 *              "terms": [
 *                  "5c76d43808c20d8f9f016a82",
 *                  "5c76d43808c20d8f9f016a83",
 *                  "5c76d43808c20d8f9f016a84",
 *                  "5c76d43808c20d8f9f016a85",
 *                  "5c76d43808c20d8f9f016a86",
 *                  "5c76d43808c20d8f9f016a87",
 *                  "5c76d43808c20d8f9f016a88",
 *                  "5c76d43808c20d8f9f016a89",
 *                  "5c76d43808c20d8f9f016a8a",
 *                  "5c76d43808c20d8f9f016a8b",
 *                  "5c76d43808c20d8f9f016a8c",
 *                  "5c76d43808c20d8f9f016a8d",
 *                  "5c76d43808c20d8f9f016a8e",
 *                  "5c76d43808c20d8f9f016a8f",
 *                  "5c76d43808c20d8f9f016a90"
 *              ],
 *              "_id": "5c76d43808c20d8f9f016a81",
 *              "name": "yeet",
 *              "user_id": "5c52a8940dadc9e7ae96e1e2",
 *              "__v": 1,
 *              "normalizedName": "yeet",
 *              "id": "5c76d43808c20d8f9f016a81"
 *          },
 *      ]
 */
plansRouter.get('/', PlanController.getPlansByUserID);

/**
 * @api {get} /plans/:id Get a plan by id
 * @apiName GetPlansByID
 * @apiGroup Plans
 *
 * @apiSuccess {Array} terms the list of term ids contained within the plan
 * @apiSuccess {String} name the name of this plan
 * @apiSuccess {String} user_id the id for the user that owns this plan
 * @apiSuccess {String} normalizedName the normalized version of the name, e.g. Plan 1 -> plan-1
 * @apiSuccess {String} id the id for the plan
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "terms": [
 *              "5c76d43808c20d8f9f016a82",
 *              "5c76d43808c20d8f9f016a83",
 *              "5c76d43808c20d8f9f016a84",
 *              "5c76d43808c20d8f9f016a85",
 *              "5c76d43808c20d8f9f016a86",
 *              "5c76d43808c20d8f9f016a87",
 *              "5c76d43808c20d8f9f016a88",
 *              "5c76d43808c20d8f9f016a89",
 *              "5c76d43808c20d8f9f016a8a",
 *              "5c76d43808c20d8f9f016a8b",
 *              "5c76d43808c20d8f9f016a8c",
 *              "5c76d43808c20d8f9f016a8d",
 *              "5c76d43808c20d8f9f016a8e",
 *              "5c76d43808c20d8f9f016a8f",
 *              "5c76d43808c20d8f9f016a90"
 *          ],
 *          "_id": "5c76d43808c20d8f9f016a81",
 *          "name": "yeet",
 *          "user_id": "5c52a8940dadc9e7ae96e1e2",
 *          "__v": 1,
 *          "normalizedName": "yeet",
 *          "id": "5c76d43808c20d8f9f016a81"
 *      },
 */
plansRouter.get('/:id', PlanController.getPlanByID);

/**
 * @api {post} /plans/ Create new plan
 * @apiName CreatePlan
 * @apiGroup Plans
 *
 * @apiParam {Object} plan the plan object to add
 * @apiParam {String} plan.name the name for the new plan
 * @apiParam {Array} plan.terms the list of terms for the new plan
 *
 * @apiSuccess {Array} terms the list of term ids contained within the plan
 * @apiSuccess {String} name the name of this plan
 * @apiSuccess {String} user_id the id for the user that owns this plan
 * @apiSuccess {String} normalizedName the normalized version of the name, e.g. Plan 1 -> plan-1
 * @apiSuccess {String} id the id for the plan
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "terms": [
 *              "5c76d43808c20d8f9f016a82",
 *              "5c76d43808c20d8f9f016a83",
 *              "5c76d43808c20d8f9f016a84",
 *              "5c76d43808c20d8f9f016a85",
 *              "5c76d43808c20d8f9f016a86",
 *              "5c76d43808c20d8f9f016a87",
 *              "5c76d43808c20d8f9f016a88",
 *              "5c76d43808c20d8f9f016a89",
 *              "5c76d43808c20d8f9f016a8a",
 *              "5c76d43808c20d8f9f016a8b",
 *              "5c76d43808c20d8f9f016a8c",
 *              "5c76d43808c20d8f9f016a8d",
 *              "5c76d43808c20d8f9f016a8e",
 *              "5c76d43808c20d8f9f016a8f",
 *              "5c76d43808c20d8f9f016a90"
 *          ],
 *          "_id": "5c76d43808c20d8f9f016a81",
 *          "name": "yeet",
 *          "user_id": "5c52a8940dadc9e7ae96e1e2",
 *          "__v": 1,
 *          "normalizedName": "yeet",
 *          "id": "5c76d43808c20d8f9f016a81"
 *      },
 */
plansRouter.post('/', (req, res, next) => {
    emptyPlan.name = req.body.plan.name;
    PlanController.createPlanForUser(emptyPlan, req.user.id).then((newPlan) => {
        res.send(PlanController.sortPlan(newPlan));
    }).catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
            res.status(409).send({ err, message: 'You have already created a plan with this name' });
        } else {
            next(err);
        }
    });
});

/**
 * @api {post} /plans/duplicate/:id Duplicate plan by id
 * @apiName DuplicatePlan
 * @apiGroup Plans
 *
 * @apiParam {String} id the id of the plan to be duplicated
 *
 * @apiSuccess {String} OK a 200 OK response
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "terms": [
 *              "5c76d43808c20d8f9f016a82",
 *              "5c76d43808c20d8f9f016a83",
 *              "5c76d43808c20d8f9f016a84",
 *              "5c76d43808c20d8f9f016a85",
 *              "5c76d43808c20d8f9f016a86",
 *              "5c76d43808c20d8f9f016a87",
 *              "5c76d43808c20d8f9f016a88",
 *              "5c76d43808c20d8f9f016a89",
 *              "5c76d43808c20d8f9f016a8a",
 *              "5c76d43808c20d8f9f016a8b",
 *              "5c76d43808c20d8f9f016a8c",
 *              "5c76d43808c20d8f9f016a8d",
 *              "5c76d43808c20d8f9f016a8e",
 *              "5c76d43808c20d8f9f016a8f",
 *              "5c76d43808c20d8f9f016a90"
 *          ],
 *          "_id": "5c76d43808c20d8f9f016a81",
 *          "name": "yeet",
 *          "user_id": "5c52a8940dadc9e7ae96e1e2",
 *          "__v": 1,
 *          "normalizedName": "yeet",
 *          "id": "5c76d43808c20d8f9f016a81"
 *      },
 */
plansRouter.post('/duplicate/:id', (req, res, next) => {
    console.log('got request to duplicate plan');
    PlanController.duplicatePlanByID(req.params.id).then((duplicatedPlan) => {
        res.send(PlanController.sortPlan(duplicatedPlan));
    }).catch((err) => {
        if (err.name === 'CastError') {
            res.status(400).send({ message: 'Sorry! We couldn\'t find that plan. Please try again later.' }); // The requested id was not valid.
        } else {
            next(err);
        }
    });
});

/**
 * @api {put} /plans/:id Update plan by id
 * @apiName UpdatePlan
 * @apiGroup Plans
 *
 * @apiParam {String} id the id of the plan to be updated
 * @apiParam {Object} any changes to the plan
 *
 * @apiSuccess {String} OK a 200 OK response
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 */
plansRouter.put('/:id', (req, res, next) => {
    console.log('got request to change plan');
    PlanController.updatePlanByID(req.body.planUpdate, req.params.id).then((result) => {
        res.sendStatus(200);
    }).catch((err) => {
        if (err.name === 'CastError') {
            res.status(400).send({ message: 'Sorry! We couldn\'t find that plan. Please try again later.' }); // The requested id was not valid.
        } else {
            next(err);
        }
    });
});

/**
 * @api {delete} /plans/:id Delete plan by id
 * @apiName DeletePlan
 * @apiGroup Plans
 *
 * @apiParam {String} id the id of the plan to be deleted
 *
 * @apiSuccess {String} OK a 200 OK response
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 */
plansRouter.delete('/:id', (req, res, next) => {
    PlanController.deletePlanByID(req.params.id).then((result) => {
        res.sendStatus(200);
    }).catch((err) => {
        if (err.name === 'CastError') {
            res.status(400).send({ message: 'Sorry! We couldn\'t find that plan. Please try again later.' }); // The requested id was not valid.
        } else {
            next(err);
        }
    });
});

export default plansRouter;
