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

const UserCourseController = {
    createUserCourse,
    deleteUserCourse,
};

export default UserCourseController;
