import UserCourse from '../models/user_course';

const createUserCourse = async (userID, courseID, termID) => {
    const newObj = await UserCourse.create({
        user: userID,
        course: courseID,
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

const UserCourseController = {
    createUserCourse,
    deleteUserCourse,
};

export default UserCourseController;
