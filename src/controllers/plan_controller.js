import Plan from '../models/plan';
import User from '../models/user';
import Term from '../models/term';
import UserCourse from '../models/user_course';
import Course from '../models/course';
import TermController from '../controllers/term_controller';
import CoursesController from '../controllers/courses_controller';
import { PopulateTerm } from './populators';

const getPlansByUserId = (req, res, next) => {
    Plan.find({ user_id: req.user.id }).populate({
        path: 'terms',
        populate: PopulateTerm,
    }).then((plans) => {
        return res.json(plans);
    }).catch((err) => {
        return next(err);
    });
};

const createPlanForUser = async (plan, userId) => {
    try {
        const newPlan = await Plan.create({
            name: plan.name,
            user_id: userId,
        });

        const { id } = await newPlan.save();
        // iterate through each term and create a term in the database for each one
        const promises = plan.terms.map((term, i) => {
            return TermController.createTerm(term, id, i);
        });

        // resolve that big promise array to get a terms array with ids that reference the Terms model
        const dbTerms = await Promise.all(promises);

        // save this to the newPlan object
        newPlan.terms = dbTerms;
        return newPlan.save();
    } catch (e) {
        throw e;
    }
};

const sortPlan = (plan) => {
    const dict = {};
    plan.terms.forEach((term) => {
        if (dict[term.year]) {
            dict[term.year].push(term);
        } else {
            dict[term.year] = [term];
        }
    });

    // map the dictionary object to a 2D array of terms, in the right order
    const sortedTerms = Object.keys(dict).map((year) => {
        const terms = dict[year];
        return terms.sort((a, b) => {
            const aTerm = a.term;
            const bTerm = b.term;
            switch (aTerm) {
            case 'F':
                return 1;
            case 'W':
                return bTerm === 'F' ? -1 : 1;
            case 'S':
                return bTerm === 'X' ? 1 : -1;
            case 'X':
                return -1;
            default:
                return 0;
            }
        });
    });

    plan.terms = sortedTerms;

    return plan;
};

export const setTermsPrevCourses = (planID, placements) => {
    return new Promise(((resolve, reject) => {
        Promise.all(placements.map((p) => {
            console.log(p);
            return Course.findById(p)
                .then((c) => {
                    return (c.xlist) ? c.xlist.concat(p) : [p];
                });
        }).flat())
            .then((placement) => {
                Plan.findById(planID)
                    .populate({
                        path: 'terms',
                        populate: PopulateTerm,
                    })
                    .then((plan) => {
                        const previousByTerm = plan.terms.map((term) => {
                            const prevCourses = [...new Set(plan.terms
                                .sort((t1, t2) => {
                                    return t1.index - t2.index;
                                })
                                .filter((t) => {
                                    return t.index < term.index;
                                })
                                .map((t) => {
                                    return t.courses;
                                })
                                .flat()
                                .filter((c) => {
                                    return c.fulfilledStatus === '';
                                })
                                .map((c) => {
                                    return c.course.id;
                                })
                                .concat(placement)
                                .flat())];
                            console.log(prevCourses);
                            return { [term._id]: prevCourses };
                        });
                        Promise.all(previousByTerm.map((t) => {
                            return Promise.all(Object.entries(t).map(([term, previousCourses]) => {
                                return Term.findByIdAndUpdate(term, { previousCourses })
                                    .then(() => {
                                        return Term.findById(term)
                                            .populate(PopulateTerm);
                                    }).then((trueTerm) => {
                                        Promise.all(trueTerm.courses.map((course) => {
                                            return CoursesController.getFulfilledStatus(planID, trueTerm._id, course.course.id)
                                                .then((status) => {
                                                    return UserCourse.update({ _id: course.id }, { fulfilledStatus: status }, { upsert: true });
                                                }).then(() => {
                                                    UserCourse.findById(course.id).populate('course').then((c) => { console.log('SET', c.course.title, c.fulfilledStatus); });
                                                });
                                        }));
                                    });
                            }));
                        })).then((r) => {
                            resolve();
                        });
                    }).catch((e) => {
                        console.log(e);
                        reject();
                    });
            });
    }));
};

const getPlanByID = (req, res) => {
    const planID = req.params.id;
    const userID = req.user.id;
    User.findById(userID)
        .then((user) => {
            setTermsPrevCourses(planID, user.placement_courses)
                .then(() => {
                    console.log('END OF FIRST');
                    return setTermsPrevCourses(planID, user.placement_courses);
                }).then(() => {
                    console.log('END OF SECOND');
                    return Plan.findById(planID);
                })
                .then((plan) => {
                    if (!plan) {
                        throw new Error('This plan does not exist for this user');
                    }
                    return plan.populate({
                        path: 'terms',
                        populate: PopulateTerm,
                    }).execPopulate();
                })
                .then((populated) => {
                    res.json(sortPlan(populated.toJSON()));
                })
                .catch((error) => {
                    console.log('Error', error);
                    res.status(400).send({ error });
                });
        });
};

// delete a plan by id
const deletePlanById = async (planId) => {
    try {
        return await Plan.findByIdAndDelete(planId);
    } catch (e) {
        throw e;
    }
};

const PlanController = {
    getPlansByUserId,
    createPlanForUser,
    sortPlan,
    getPlanByID,
    deletePlanById,
};

export default PlanController;
