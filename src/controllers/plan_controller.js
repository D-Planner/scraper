import Plan from '../models/plan';
import TermController from './term_controller';

const getPlansByUserId = (id) => {
    return Plan.find({ user_id: id });
};

const createPlanForUser = async (plan, userId) => {
    try {
        const newPlan = await Plan.create({
            name: plan.name,
            user_id: userId,
        });

        const { planId } = await newPlan.save();

        // iterate through each year in the terms dictionary
        // and create terms for each element in the arrays therein
        const storedTerms = {};
        const yearPromises = Object.keys(plan.terms).map((year) => {
            const termPromises = plan.terms[year].map((term) => {
                return TermController.createTerm(term, planId);
            });
            return Promise.all(termPromises).then((result) => {
                // store the resulting ids in the corresponding year
                storedTerms[year] = result.map((x) => { return x.id; });
            }).catch((err) => {
                console.log(err);
            });
        });

        // resolve that massive promise
        await Promise.all(yearPromises);

        // we now have a terms array that references each term's id in mongodb
        // save this to the newPlan object
        newPlan.terms = storedTerms;
        return newPlan.save();
    } catch (e) {
        throw e;
    }
};

const PlanController = {
    getPlansByUserId,
    createPlanForUser,
};

export default PlanController;
