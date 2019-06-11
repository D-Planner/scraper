import UserCourse from '../models/user_course';

const createUserCourse = async (userID, catalogCourseID, termID) => {
    const newObj = await UserCourse.create({
        user: userID,
        course: catalogCourseID,
        term: termID,
        major: null,
        distrib: null,
        wc: null,
        timeslot: null,
    });

    return newObj.save();
};

const deleteUserCourse = async (userCourseID) => {
    try {
        await UserCourse.findByIdAndRemove(userCourseID);
        return null;
    } catch (e) {
        return e;
    }
};

const updateUserCourse = async (req, res, next) => {
    const change = req.body;
    // Do we want to make sure that we don't let two UserCourses have the same timeslot

    try {
        await UserCourse.findByIdAndUpdate(req.params.userCourseID, change);
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
    deleteUserCourse,
    updateUserCourse,
    getCourse,
};

export default UserCourseController;
