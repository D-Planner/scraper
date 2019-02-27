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

const updateTerm = (req, res) => {
    Term.findByIdAndUpdate(req.params.id, {
        plan_id: req.body.plan_id,
        year: req.body.year,
        quarter: req.body.quarter,
        off_term: req.body.off_term,
        courses: req.body.courses,
    }, { new: true })
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const TermController = {
    createTerm,
    updateTerm,
};

export default TermController;
