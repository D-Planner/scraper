import Term from '../models/term';
import User from '../models/user';
import UserCourse from '../models/user_course';
import UserCourseController from '../controllers/user_course_controller';
import { setTermsPrevCourses } from '../controllers/plan_controller';
import { PopulateTerm } from './populators';

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

const addCourseToTerm = (req, res) => {
    const termID = req.params.termID;
    Term.findById(termID)
        .then((term) => {
            User.findById(req.user.id)
                .then((user) => {
                    if (user.completed_courses.filter((c) => { return c.id === req.body.course.id; }).length === 0) {
                        UserCourseController.createUserCourse(req.user.id, req.body.course.id, termID)
                            .then((userCourse) => {
                                term.courses.push(userCourse);
                                return term.save();
                            })
                            .then(() => {
                                addCompleted(req.user.id, req.body.course.id);
                                // console.log('COURSE ADDED TO TERM');
                                return setTermsPrevCourses(req.body.planID, user.placement_courses);
                            })
                            .then(() => {
                                res.send(term);
                            })
                            .catch((e) => {
                                console.log(e);
                            });
                    } else {
                        res.sendStatus(409).json({ message: 'This course already exists in this term' });
                    }
                });
        });
    // TO-DO: build in auto-scheduler that will put in appropriate course hour that fits with the other courses in the term
    // const populated = await term.populate(PopulateTerm).execPopulate();
    //
    // const user = await User.findById(req.user.id).populate('completed_courses');
    //
    // // check if a course with this id already exists in the term
    // if (populated.courses.filter((c) => { return c.course.id === req.body.course.id; }).length === 0) {
    //     term.courses.push(userCourse);
    // } else {
    //     res.status(409).json({ message: 'This course already exists in this term' });
    // }
    // if (user.completed_courses.filter((c) => { return c.course.id === req.body.course.id; }).length === 0) {
    //     user.completed_courses.push(userCourse);
    // }
    //
    // await term.save();
    // await user.save();

    // check if a course with this id already exists in the user's completed courses
};

const removeCourseFromTerm = (req, res) => {
    const { userCourseID, termID, planID } = req.params;
    const userID = req.user.id;

    Term.findById(termID)
        .then((term) => {
            term.courses.filter((c) => {
                return c.toString() !== userCourseID.toString();
            });
            term.save()
                .then((t) => {
                    return UserCourse.findById(userCourseID).populate('course');
                })
                .then((userCourse) => {
                    return removeCompleted(userID, userCourse.course.id);
                })
                .then(() => {
                    return UserCourseController.deleteUserCourse(userCourseID);
                })
                .then(() => {
                    return User.findById(userID);
                })
                .then((user) => {
                    return setTermsPrevCourses(planID, user.placement_courses);
                })
                .then(() => {
                    res.json(term);
                });
        }).catch((e) => {
            console.log(e);
            res.status(400).json({ e });
        });
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
