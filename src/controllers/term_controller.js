import Term from '../models/term';

const createTerm = async (term, planID) => {
    const newTerm = await Term.create({
        plan_id: planID,
        year: term.year,
        quarter: term.quarter,
        off_term: term.off_term,
        courses: term.courses.map((course) => { return course.id; }),
    });


    return newTerm.save();
};

const TermController = {
    createTerm,
};

export default TermController;
