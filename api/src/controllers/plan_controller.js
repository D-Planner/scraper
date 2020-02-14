import mongoose from 'mongoose';
import Plan from '../models/plan';
// import Term from '../models/term';
import User from '../models/user';
// import UserCourse from '../models/user_course';
import TermController from '../controllers/term_controller';
// import CoursesController from '../controllers/courses_controller';
import { PopulateTerm, PopulateUser } from './populators';

const getPlansByUserID = (req, res, next) => {
    Plan.find({ user_id: req.user.id }).then((plans) => {
        const planNames = plans.map((plan) => { return { id: plan.id, name: plan.name }; });
        return res.json(planNames);
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
                    return {
                        year: currYear,
                        quarter: terms[currQuarter],
                        off_term: term.off_term,
                        courses: term.courses.map((userCourse) => { return userCourse.course.id; }),
                    };
                });
                try {
                    // Converts strings in relevant_interests to UUIDs
                    const tempRelevantInterests = [];
                    if (plan.relevant_interests) {
                        plan.relevant_interests.map((interest) => {
                        // eslint-disable-next-line new-cap
                            return tempRelevantInterests.push(mongoose.Types.ObjectId(interest));
                        });
                    }

                    // Converts strings in comments to UUIDs
                    const tempComments = [];
                    if (plan.comments) {
                        plan.comments.map((interest) => {
                            // eslint-disable-next-line new-cap
                            return tempComments.push(mongoose.Types.ObjectId(interest));
                        });
                    }

                    const newPlan = await Plan.create({
                        name: plan.name,
                        user_id: userID,
                        duplicatedFrom: plan.id,
                        description: plan.description,
                        relevant_interests: tempRelevantInterests,
                        comments: tempComments,
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
                    reject(e);
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
            const planToBeDuplicated = populatedPlan.toJSON();
            planToBeDuplicated.name += ' Copy';
            createPlanForUser(planToBeDuplicated, planToBeDuplicated.user_id).then((blankPlan) => {
                resolve(blankPlan);
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
