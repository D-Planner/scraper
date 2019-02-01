import Term from '../models/term';

const createTerm = async (term, planID) => {
    const newTerm = await Term.create({
        name: term.name,
        off_term: term.off_term,
        // N.B. replace with real course ids once they are in the db
        courses: term.courses.map((course) => { return course.id; }),
        plan_id: planID,
    });

    return newTerm.save();
};

const TermController = {
    createTerm,
};

export default TermController;
