import Term from '../models/term';
import User from '../models/user';
import UserCourse from '../models/user_course';
import UserCourseController from '../controllers/user_course_controller';
import { PopulateTerm, PopulateCourse } from './populators';

// Not used anymore because completed_courses are calculated in frontend
// const addCompleted = (userID, courseID) => {
//     User.findByIdAndUpdate(userID, {
//         $push: { completed_courses: courseID },
//     }, { new: true }).then((result) => {
//     }).catch((error) => {
//         console.log(error);
//     });
// };

// const removeCompleted = (userID, courseID) => {
//     console.log('REMOVING COURSE FROM COMPLETED, ', courseID);
//     return new Promise((resolve, reject) => {
//         User.findByIdAndUpdate(userID, {
//             $pull: { completed_courses: courseID },
//         }, { new: true }).then((result) => {
//             resolve();
//         }).catch((error) => {
//             console.log(error);
//             reject();
//         });
//     });
// };

// const addCustomToTerm = (req, res) => {
//     console.log('ADD Custom TO TERM', req.body);
//     const termID = req.params.termID;
//     Term.findById(termID)
//         .then((term) => {
//             UserCourseController.createPlacementCourse(req.user.id, termID, req.body.department).then((customCourse) => {
//                 term.courses.push(customCourse);
//                 console.log(term);
//                 return term.save();
//             });
//         })
//         .then((r) => {
//             res.send(200);
//         })
//         .catch((e) => {
//             console.log(e);
//             res.status(500).json({ e });
//         });
// };


// const removeCustomFromTerm = (req, res) => {
//     const { termID, department } = req.params;
//     console.log(department);
//     Term.findById(termID)
//         .populate({ path: 'courses' })
//         .then((term) => {
//             console.log(term.courses);
//             term.courses = term.courses.filter((c) => {
//                 return c.custom !== department;
//             });
//             return term.save();
//         })
//         .then((r) => {
//             res.send(200);
//         })
//         .catch((e) => {
//             res.status(500).json({ e });
//         });
// };

const addCourseToTerm = (req, res) => {
    const termID = req.params.termID;
    console.log(req.body.custom);
    Term.findById(termID)
        .then((term) => {
            User.findById(req.user.id)
                .then((foundUser) => {
                    new Promise((resolve, reject) => {
                        resolve((req.body.custom)
                            ? UserCourseController.createCustomCourse(req.user.id, termID, req.body.custom)
                            : UserCourseController.createUserCourse(req.user.id, termID, req.body.courseID));
                    }).then((course) => {
                        console.log(course);
                        term.courses.push(course);
                        term.save().then(() => {
                            course.populate({
                                path: 'course',
                                populate: PopulateCourse,
                            }).execPopulate().then((populated) => {
                                foundUser.totalUpdateTermCalls += 1;
                                foundUser.save(() => {
                                    res.send(populated);
                                });
                            });
                        });
                    })
                        .catch((e) => {
                            console.log(e);
                        });
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
    const { userCourseID, termID } = req.params;
    // const userID = req.user.id;
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
                    // return removeCompleted(userID, userCourse.course.id); let's not do this because we don't want a universal list of compelted_courses
                })
                .then(() => {
                    return UserCourseController.deleteUserCourse(userCourseID);
                })
                // .then((user) => {
                //     return setTermsPrevCourses(planID, userID);
                // })
                .then(() => {
                    User.findById(req.user.id).then((foundUser) => {
                        foundUser.totalUpdateTermCalls += 1;
                        foundUser.save(() => {
                            res.json(term);
                        });
                    });
                });
        }).catch((e) => {
            console.log(e);
            res.status(400).json({ e });
        });
};

const createTerm = async (term, planID, index, userID) => {
    return new Promise((resolve, reject) => {
        Term.create({
            plan_id: planID,
            year: term.year,
            quarter: term.quarter,
            off_term: term.off_term,
            courses: term.courses,
            index,
        }).then((newlyCreatedTerm) => {
            Promise.all(term.courses.map((courseID) => {
                return new Promise((resolve, reject) => {
                    addCourseToTerm({ params: { termID: newlyCreatedTerm.id }, user: { id: userID }, body: { courseID } });
                    resolve();
                });
            })).then(() => {
                resolve(newlyCreatedTerm);
            });
        });
    });
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
