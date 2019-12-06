import UserCourse from '../models/user_course';
import Course from '../models/course';

const createUserCourse = (userID, catalogCourseID, termID) => {
    return Course.findById(catalogCourseID).then(async (r) => {
        const newCourse = await UserCourse.create({
            user: userID,
            course: catalogCourseID,
            term: termID,
            major: null,
            distrib: null,
            wc: null,
            timeslot: r.preiods && r.periods.length === 1 ? r.periods[0] : null,
            fulfilledStatus: '',
        });
        return newCourse.save();
    });
};

const createPlacementCourse = async (userID, termID, department) => {
    const newCourse = await UserCourse.create({
        user: userID,
        course: null,
        term: termID,
        major: null,
        distrib: null,
        wc: null,
        timeslot: null,
        fulfilledStatus: '',
        placeholder: department,
    });
    return newCourse.save();
};

// const deleteUserCourse = async (userCourseID) => {
//     try {
//         await UserCourse.findByIdAndRemove(userCourseID);
//         return null;
//     } catch (e) {
//         return e;
//     }
// };

const deleteUserCourse = (userCourseID) => {
    return new Promise((resolve, reject) => {
        UserCourse.findByIdAndRemove(userCourseID).then(() => {
            resolve(null);
        }).catch((error) => {
            reject(error);
        });
    });
};

const updateUserCourse = async (req, res, next) => {
    const change = req.body;
    // Do we want to make sure that we don't let two UserCourses have the same timeslot
    console.log(change);
    try {
        UserCourse.findByIdAndUpdate(req.params.userCourseID, change).then((r) => {
            console.log(r);
        });
        res.status(201).json('Saved');
    } catch (e) {
        next(e);
    }
    res.send();
};

const getCourse = async (req, res) => {
    try {
        const course = await UserCourse.findById(req.params.userCourseID);
        res.json(course);
    } catch (e) {
        res.status(500).json({ e });
    }
};

const UserCourseController = {
    createUserCourse,
    createPlacementCourse,
    deleteUserCourse,
    updateUserCourse,
    getCourse,
};

export default UserCourseController;
