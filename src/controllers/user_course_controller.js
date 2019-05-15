import UserCourse from '../models/user_course';

const createUserCourse = async (userID, courseID, termID) => {
    const newObj = await UserCourse.create({
        user_id: userID,
        course_id: courseID,
        term_id: termID,
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
