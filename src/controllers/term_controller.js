import Term from '../models/term';
import User from '../models/user';
import UserCourseController from '../controllers/user_course_controller';
import PopulateTerm from './populators';

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
    const populated = await term.populate(PopulateTerm).execPopulate();

    const user = await User.findById(req.user.id).populate('completed_courses');

    // check if a course with this id already exists in the term
    if (populated.courses.filter((c) => { return c.course.id === req.body.course.id; }).length === 0) {
        term.courses.push(userCourse);
    } else {
        res.status(409).json({ message: 'This course already exists in this term' });
    }
    if (user.completed_courses.filter((c) => { return c.course.id === req.body.course.id; }).length === 0) {
        user.completed_courses.push(userCourse);
    }

    await term.save();
    await user.save();

    res.send(term);
};

const removeCourseFromTerm = async (req, res, next) => {
    const termID = req.params.termID;
    const term = await Term.findById(termID);
    const userCourseID = req.params.userCourseID;
    const user = await User.findById(req.user.id);
    console.log(user);

    // filter out the course we are removing and save the new object
    term.courses = term.courses.filter((c) => { return c.toString() !== userCourseID.toString(); });
    user.completed_courses = user.completed_courses.filter((c) => { return c.toString() !== userCourseID.toString(); });
    await term.save();
    await user.save();

    // delete the user course object
    const err = await UserCourseController.deleteUserCourse(userCourseID);
    if (err) {
        next(err);
    }

    res.status(200).json(term);
};

const getTerm = async (req, res) => {
    try {
        const term = await Term.findById(req.params.termID)
            .populate(PopulateTerm);
        res.json(term);
    } catch (e) {
        res.status(500).json({ e });
    }
};

const TermController = {
    createTerm,
    updateTerm,
    addCourseToTerm,
    removeCourseFromTerm,
    getTerm,
};

export default TermController;
