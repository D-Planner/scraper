import announcementsJSON from '../../static/data/announcements.json';

const getAnnouncements = async (req, res) => {
    try {
        console.log(announcementsJSON);
        res.json(announcementsJSON);
    } catch (e) {
        res.status(500).json({ e });
        console.log(e);
    }
};

// const getCourse = async (req, res) => {
//   try {
//       const course = await UserCourse.findById(req.params.userCourseID);
//       res.json(course);
//   } catch (e) {
//       res.status(500).json({ e });
//   }
// };

const announcementsController = {
    getAnnouncements,
};

// const UserCourseController = {
//   createUserCourse,
//   deleteUserCourse,
//   updateUserCourse,
//   getCourse,
// };

export default announcementsController;
