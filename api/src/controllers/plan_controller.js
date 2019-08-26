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
    placements = placements.map((p) => {
        return Course.findById(p)
            .then((c) => {
                return c.xlist;
            });
    }).flat();
    return new Promise(((resolve, reject) => {
        Promise.resolve(Plan.findById(planID).populate({
            path: 'terms',
            populate: PopulateTerm,
        })).then((plan) => {
            plan.terms.sort((t1, t2) => {
                return t1.index - t2.index;
            }).reduce((acc, curr) => {
                // Get the last courses
                let next = curr.courses.map((course) => {
                    console.log(course.course.title);
                    if (course.fulfilledStatus !== '') return [];
                    return course.course.xlist ? course.course.xlist.concat(course.course._id) : [course.course._id];
                });
                if (!next) next = [];

                Promise.all(acc).then((ac) => {
                    Term.update({ _id: curr._id }, { previousCourses: ac.flat() })
                        .then(() => {
                            Promise.all(curr.courses.map((course) => {
                                return Promise.resolve(CoursesController.getFulfilledStatus(planID, curr._id, course.course.id))
                                    .then((status) => {
                                        return UserCourse.update({ _id: course.id }, { fulfilledStatus: status }, { upsert: true });
                                    }).then(() => {
                                        UserCourse.findById(course.id).populate('course').then((c) => { console.log(c); });
                                    });
                            }));
                        })
                        .catch((e) => {
                            return e;
                        });
                });

                acc = acc.concat(next);

                return acc;
            }, placements);
            resolve();
        }).catch((e) => {
            console.log(e);
            reject();
        });
    }));
};

const getPlanByID = (req, res) => {
    const planID = req.params.id;
    const userID = req.user.id;
    User.findById(userID)
        .then((user) => {
            return setTermsPrevCourses(planID, user.placement_courses).then(() => {
                setTermsPrevCourses(planID, user.placement_courses);
            });
        })
        .then(() => {
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
