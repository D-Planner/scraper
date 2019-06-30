import Term from '../models/term';
import User from '../models/user';
import UserCourse from '../models/user_course';
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

const addCompleted = (userID, courseID) => {
    User.findByIdAndUpdate(userID, {
        $push: { completed_courses: courseID },
    }, { new: true }).then((result) => {
    }).catch((error) => {
        console.log(error);
    });
};

const removeCompleted = (userID, courseID) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(userID, {
            $pull: { completed_courses: courseID },
        }, { new: true }).then((result) => {
            resolve();
        }).catch((error) => {
            console.log(error);
            reject();
        });
    });
};

const addCourseToTerm = async (req, res, next) => {
    const termID = req.params.termID;
    const userCourse = await UserCourseController.createUserCourse(req.user.id, req.body.course.id, termID);
    // TO-DO: build in auto-scheduler that will put in appropriate course hour that fits with the other courses in the term

    const term = await Term.findById(termID);
    // const populated = await term.populate({
    //     path: 'courses',
    //     populate: {
    //         path: 'course',
    //     },
    // }).execPopulate();

    // // check if a course with this id already exists in the term
    // if (populated.courses.filter((c) => { return c.course.id === req.body.course.id; }).length === 0) {
    //     term.courses.push(userCourse);
    // } else {
    //     res.status(409).json({ message: 'This course already exists in this term' });
    // }

    // check if a course with this id already exists in the user's completed courses
    User.findById(req.user.id).populate('completed_courses').then((user) => {
        if (user.completed_courses.filter((c) => { return c.id === req.body.course.id; }).length === 0) {
            term.courses.push(userCourse);
            term.save().then(() => {
                addCompleted(req.user.id, req.body.course.id);
                res.send(term);
            });
        } else {
            res.status(409).json({ message: 'This course already exists in this term' });
        }
    });
};

const removeCourseFromTerm = async (req, res, next) => {
    const termID = req.params.termID;
    const term = await Term.findById(termID);
    const userCourseID = req.params.userCourseID;

    // filter out the course we are removing and save the new object
    term.courses = term.courses.filter((c) => { return c.toString() !== userCourseID; });

    await term.save();

    // remove the course from the user's completed courses
    UserCourse.findById(userCourseID).populate('course').then((userCourse) => {
        removeCompleted(req.user.id, userCourse.course.id).then(() => {
        // delete the user course object
            UserCourseController.deleteUserCourse(userCourseID).then(() => {
                res.status(200).json(term);
            }).catch((error) => {
                next(error);
            });
        });
    });
};

const getTerm = async (req, res) => {
    try {
        const term = await Term.findById(req.params.termID)
            .populate({
                path: 'courses',
                populate: {
                    path: 'course',
                },
            });
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
