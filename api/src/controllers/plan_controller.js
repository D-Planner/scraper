import Plan from '../models/plan';
import Term from '../models/term';

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

        // iterate through each term and create a term in the database for each one
        const promises = plan.terms.map((term) => {
            return Term.create({
                plan_id: planId,
                year: term.year,
                quarter: term.quarter,
                off_term: term.off_term,
                courses: term.courses,
            });
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
    return Object.keys(dict).map((year) => {
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
};

const PlanController = {
    getPlansByUserId,
    createPlanForUser,
    sortPlan,
};

export default PlanController;
