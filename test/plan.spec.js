import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import app from '../src/server';
import User from '../src/models/user';
import Plan from '../src/models/plan';
import PlanController from '../src/controllers/plan_controller';

let token = '';
let userID = '';
let planID = '';
const planName = 'new-plan';

describe('Plans', () => {
    before((done) => {
        // delete if this user already exists
        User.findOneAndDelete({ email: 'test@example.com' }).then(() => {
            // create a new user
            request(app)
                .post('/auth/signup')
                .send({
                    email: 'test@example.com',
                    password: 'password',
                    username: 'test',
                })
                .end((err, res) => {
                    expect(res.body.token, 'Token should exist').to.exist;
                    expect(res.body.user, 'User object should exist').to.exist;
                    token = res.body.token;
                    userID = res.body.user.id;

                    // create a plan for this user
                    const plan = {
                        name: planName,
                        user_id: userID,
                        terms: [
                            {
                                year: 2018,
                                quarter: 'F',
                                off_term: false,
                                courses: [],
                            },
                            {
                                year: 2019,
                                quarter: 'W',
                                off_term: false,
                                courses: [],
                            },
                        ],
                    };
                    PlanController.createPlanForUser(plan, userID).then((newPlan) => {
                        planID = newPlan.id;
                        done();
                    }).catch((err) => {
                        expect.fail(err);
                    });
                });
        });
    });

    // delete the plan and the user
    after((done) => {
        Plan.findByIdAndDelete(planID).then(() => {
            return User.findByIdAndDelete(userID);
        }).then(() => {
            done();
        }).catch((err) => {
            expect.fail(err);
            done();
        });
    });

    describe('#getPlans', () => {
        it('should fetch all plans for a given user', (done) => {
            request(app)
                .get('/plans')
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    expect(res.body).to.be.an('array');

                    const firstPlan = res.body[0];
                    expect(firstPlan.name).to.equal(planName);
                    expect(firstPlan.terms).to.exist.and.be.an('array');

                    done();
                });
        });
    });

    describe('#getPlanByName', () => {
        it('should fetch a single plan by name if it exists', (done) => {
            request(app)
                .get(`/plans/${planName}`)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    expect(res.body.name).to.equal(planName);
                    expect(res.body.terms).to.exist.and.be.an('array');

                    done();
                });
        });

        it('should fail to fetch a nonexistent plan', (done) => {
            request(app)
                .get('/plans/fake-plan')
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    expect(res.status).to.equal(500);
                    done();
                });
        });
    });

    describe('#addPlan', () => {
        let newerPlanID = '';

        after((done) => {
            Plan.findByIdAndDelete(newerPlanID).then(() => {
                done();
            }).catch((err) => {
                expect.fail(err);
            });
        });

        it('should add a new plan with a unique name for this user', (done) => {
            const plan = {
                name: 'newer-plan',
                user_id: userID,
                terms: [
                    {
                        year: 2019,
                        quarter: 'S',
                        off_term: false,
                        courses: [],
                    },
                    {
                        year: 2019,
                        quarter: 'X',
                        off_term: false,
                        courses: [],
                    },
                ],
            };

            request(app)
                .post('/plans')
                .send({ plan })
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    expect(res.body.name).to.equal('newer-plan');
                    expect(res.body.terms).to.exist.and.be.an('array');

                    newerPlanID = res.body.id;

                    done();
                });
        });

        it('should not add a new plan with a non-unique name', (done) => {
            const plan = {
                name: 'newer-plan',
                user_id: userID,
                terms: [
                    {
                        year: 2019,
                        quarter: 'S',
                        off_term: false,
                        courses: [],
                    },
                    {
                        year: 2019,
                        quarter: 'X',
                        off_term: false,
                        courses: [],
                    },
                ],
            };

            request(app)
                .post('/plans')
                .send({ plan })
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    expect(res.status).to.equal(409);

                    done();
                });
        });
    });

    describe('#deletePlanById', () => {
        const newPlanName = 'Newer Plan';
        let newPlanID = '';

        before((done) => {
            const plan = {
                name: newPlanName,
                user_id: userID,
                terms: [
                    {
                        year: 2018,
                        quarter: 'F',
                        off_term: false,
                        courses: [],
                    },
                    {
                        year: 2019,
                        quarter: 'W',
                        off_term: false,
                        courses: [],
                    },
                ],
            };
            PlanController.createPlanForUser(plan, userID).then((newPlan) => {
                newPlanID = newPlan.id;
                done();
            }).catch((err) => {
                expect.fail(err);
            });
        });

        it('should delete a plan that exists', (done) => {
            request(app)
                .delete(`/plans/${newPlanID}`)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    expect(res.status).to.equal(200);

                    Plan.findById(newPlanID).then((plan) => {
                        console.log(plan);
                        expect(plan).to.equal(null);
                        done();
                    }).catch((err) => {
                        console.log(err);
                    });
                });
        });

        it('should not fail if deleting a plan whose id cannot be found', () => {
            request(app)
                .delete(`/plans/${newPlanID}`)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                });
        });

        it('should fail to delete a plan given a bad id', () => {
            request(app)
                .delete('/plans/somefakeid')
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                });
        });
    });
});
