import Plan from '../models/plan';
import User from '../models/user';
import UserCourse from '../models/user_course';
import Course from '../models/course';
import TermController from '../controllers/term_controller';
import { PopulateTerm } from './populators';


const getPlansByUserId = (id) => {
    return Plan.find({ user_id: id }).populate({
        path: 'terms',
        populate: PopulateTerm,
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
        const promises = plan.terms.map((term) => {
            return TermController.createTerm(term, id);
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
            plan.terms.reduce((acc, curr) => {
            // Get the last courses
                let next = curr.courses.map((course) => {
                    return UserCourse.findById(course._id)
                        .populate('course', '_id xlist')
                        .then((c) => {
                            return c.course.xlist ? c.course.xlist.concat(c.course._id) : [c.course._id];
                        })
                        .catch((e) => {
                            console.log(e);
                        });
                }).map((promise) => {
                    return promise.then((r) => {
                        return r;
                    });
                });
                if (!next) next = [];

                Promise.all(acc).then((ac) => {
                    curr.courses.forEach((course) => {
                    // console.log('Server', course.course.number, 'Previous Coursecourse', ac.flat());
                        UserCourse.update({ _id: course._id }, { previousCourses: ac.flat() }).then((r) => { return r; }).catch((e) => { return e; });
                    // UserCourse.findById(course._id).then((r) => { console.log(r); }).catch((e) => { return e; });
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
            return setTermsPrevCourses(planID, user.placement_courses);
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
    //   try {
    //       const plan = await Plan.findById(planID);
    //
    //       if (!plan) {
    //           throw new Error('This plan does not exist for this user');
    //       }
    //       const populated = await plan.populate({
    //           path: 'terms',
    //           populate: PopulateTerm,
    //       }).execPopulate();
    //
    //       populated.terms.forEach((term) => {
    //           term.courses.forEach((course) => {
    //               // console.log(course.course.department, course.course.number, 'Previous Coursecourse', course.previousCourses);
    //           });
    //       });
    //       return sortPlan(populated.toJSON());
    //   } catch (e) {
    //       throw e;
    //   }
    // });
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
