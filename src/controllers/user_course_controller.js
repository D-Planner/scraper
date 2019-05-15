import UserCourse from '../models/user_course';

const createUserCourse = async (userID, courseID, termID) => {
    const newObj = await UserCourse.create({
        user: userID,
        course: courseID,
        term: termID,
        distrib: null,
        wc: null,
        timeslot: null,
    });

    return newObj.save();
};

const deleteUserCourse = (req, res) => {

};

const UserCourseController = {
    createUserCourse,
    deleteUserCourse,
};

export default UserCourseController;
