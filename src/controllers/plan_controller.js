import Plan from '../models/plan';
// import Term from '../models/term';
import User from '../models/user';
// import UserCourse from '../models/user_course';
import TermController from '../controllers/term_controller';
// import CoursesController from '../controllers/courses_controller';
import { PopulateTerm, PopulateUser } from './populators';
// import { emptyPlan } from '../../static/emptyplan';

const getPlansByUserID = (req, res, next) => {
    Plan.find({ user_id: req.user.id }).populate({
        path: 'terms',
        populate: PopulateTerm,
    }).then((plans) => {
        return res.json(plans);
    }).catch((err) => {
        return next(err);
    });
};

const createPlanForUser = (plan, userID) => {
    return new Promise((resolve, reject) => {
        const terms = ['F', 'W', 'S', 'X'];
        User.findById(userID).populate(PopulateUser)
            .then(async (user) => {
                const json = user.toJSON();
                delete json.password;
                let currYear = user.graduationYear - 4;
                let currQuarter = -1;
                const planTerms = plan.terms.map((term) => {
                    if (currQuarter === 3) currYear += 1;
                    currQuarter = (currQuarter + 1) % 4;
                    if (term.index === 1) console.log(term.courses);
                    return {
                        year: currYear,
                        quarter: terms[currQuarter],
                        off_term: false,
                        courses: term.courses.map((userCourse) => { return userCourse.course.id; }),
                    };
                });
                try {
                    const newPlan = await Plan.create({
                        name: plan.name,
                        user_id: userID,
                    });

                    const { id } = await newPlan.save();

                    // iterate through each term and create a term in the database for each one
                    const promises = planTerms.map((term, i) => {
                        return TermController.createTerm(term, id, i, userID);
                    });

                    // resolve that big promise array to get a terms array with ids that reference the Terms model
                    const dbTerms = await Promise.all(promises);

                    // save this to the newPlan object
                    newPlan.terms = dbTerms;
                    newPlan.save().then((savedPlan) => {
                        resolve(savedPlan);
                    });
                } catch (e) {
                    throw e;
                }
            });
    });
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

// export const setTermsPrevCourses = (planID, userID) => {
//     return new Promise(((resolve, reject) => {
//         Plan.findById(planID)
//             .populate({
//                 path: 'terms',
//                 populate: PopulateTerm,
//             })
//             .then((plan) => {
//                 const previousByTerm = plan.terms.map((term) => {
//                     const prevCourses = [...new Set(plan.terms
//                         .sort((t1, t2) => {
//                             return t1.index - t2.index;
//                         })
//                         .filter((t) => {
//                             return t.index < term.index;
//                         })
//                         .map((t) => {
//                             return t.courses;
//                         })
//                         .flat()
//                         .filter((c) => {
//                             return c.fulfilledStatus === '';
//                         })
//                         .map((c) => {
//                             return (c.course.xlist.length) ? [...c.course.xlist, c.course.id] : c.course.id;
//                         })
//                         .flat())];
//                     return { [term._id]: prevCourses };
//                 });
//                 Promise.all(previousByTerm.map((t) => {
//                     return Promise.all(Object.entries(t).map(([term, previousCourses]) => {
//                         return Term.findByIdAndUpdate(term, { previousCourses })
//                             .then(() => {
//                                 return Term.findById(term)
//                                     .populate(PopulateTerm);
//                             }).then((trueTerm) => {
//                                 return Promise.all(trueTerm.courses.map((course) => {
//                                     return Promise.resolve(CoursesController.getFulfilledStatus(planID, trueTerm._id, course.course.id, userID))
//                                         .then((status) => {
//                                             // console.log(`Updating ${course.course.title} to ${status}`);
//                                             return UserCourse.update({ _id: course.id }, { fulfilledStatus: status }, { upsert: true });
//                                         });
//                                 // .then(() => {
//                                 //     UserCourse.findById(course.id).populate('course').then((c) => { console.log('SET', c.course.title, c.fulfilledStatus); });
//                                 // });
//                                 }));
//                             });
//                     })).then((r) => {
//                         // console.log('{1}', r);
//                         return r;
//                     });
//                 })).then((r) => {
//                     // console.log('{2}', r);
//                     resolve();
//                 });
//             }).catch((e) => {
//                 console.log(e);
//                 reject();
//             });
//     }));
// };

const getPlanByID = (req, res) => {
    const planID = req.params.id;
    Plan.findById(planID).then((plan) => {
        if (!plan) {
            throw new Error('This plan does not exist for this user');
        }
        return plan.populate({
            path: 'terms',
            populate: PopulateTerm,
        }).execPopulate();
    }).then((populated) => {
        res.json(sortPlan(populated.toJSON()));
    });
};

const duplicatePlanByID = (planID) => {
    return new Promise((resolve, reject) => {
        Plan.findById(planID).then((plan) => {
            if (!plan) {
                throw new Error('This plan does not exist for this user');
            }
            return plan.populate({
                path: 'terms',
                populate: PopulateTerm,
            }).execPopulate();
        }).then((populatedPlan) => {
            console.log(populatedPlan.toJSON().terms[1].courses);
            createPlanForUser(populatedPlan.toJSON(), populatedPlan.toJSON().user_id).then((blankPlan) => {
                resolve(blankPlan);
                // const duplicateTermspromises = blankPlan.terms.map((term) => {
                //     return new Promise((resolve, reject) => {
                //         const duplicateCoursespromises =
                //         TermController.addCourseToTerm({ params: { termID: term.id }, user: { id: populatedPlan.toJSON().user_id }, body: {courseID: } });
                //     });
                // });
                // Promises.all(duplicateTermspromises).then(() => {

                // });
            });
        });
    });
};

const updatePlanByID = async (planUpdate, planId) => {
    return Plan.findByIdAndUpdate(planId, planUpdate);
};

// delete a plan by id
const deletePlanByID = async (planId) => {
    try {
        return await Plan.findByIdAndDelete(planId);
    } catch (e) {
        throw e;
    }
};

const PlanController = {
    getPlansByUserID,
    createPlanForUser,
    sortPlan,
    getPlanByID,
    duplicatePlanByID,
    updatePlanByID,
    deletePlanByID,
};

export default PlanController;
