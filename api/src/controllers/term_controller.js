import Term from '../models/term';
import UserCourseController from '../controllers/user_course_controller';

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

const addCourseToTerm = async (req, res, next) => {
    const termID = req.params.termID;
    const userCourse = await UserCourseController.createUserCourse(req.user.id, req.body.course.id, termID);

    const term = await Term.findById(termID);
    const populated = await term.populate({
        path: 'courses',
        populate: {
            path: 'course',
        },
    }).execPopulate();

    // check if a course with this id already exists in the term
    if (populated.courses.filter((c) => { return c.course.id === req.body.course.id; }).length === 0) {
        term.courses.push(userCourse);
    } else {
        res.status(409).json({ message: 'This course already exists in this term' });
    }

    await term.save();

    res.send(term);
};

const removeCourseFromTerm = async (req, res, next) => {
    const termID = req.params.termID;
    const term = await Term.findById(termID);
    const userCourseID = req.params.userCourseID;

    // filter out the course we are removing and save the new object
    term.courses = term.courses.filter((c) => { return c.toString() !== userCourseID; });
    await term.save();

    // delete the user course object
    const err = await UserCourseController.deleteUserCourse(userCourseID);
    if (err) {
        next(err);
    }

    res.status(200).json(term);
};

const TermController = {
    createTerm,
    updateTerm,
    addCourseToTerm,
    removeCourseFromTerm,
};

export default TermController;
