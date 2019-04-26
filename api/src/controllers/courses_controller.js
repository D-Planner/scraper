import Course from '../models/course';
import User from '../models/user';
import courses from '../../static/data/courses.json';

const getCourses = (req, res) => {
    Course.find({})
        .then((result) => {
            res.json(result);
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const getCourse = (req, res) => {
    Course.find({ _id: req.params.id })
        .then((result) => {
            res.json(result);
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const getCoursesByDepartment = (req, res) => {
    Course.find({ department: req.params.department })
        .then((result) => {
            res.json(result);
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const getCoursesByDistrib = (req, res) => {
    Course.find({ distrib: req.params.distrib })
        .then((result) => {
            res.json(result);
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const getCoursesByWC = (req, res) => {
    Course.find({ wc: req.params.wc })
        .then((result) => {
            res.json(result);
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const getCourseByName = (req, res) => {
    Course.find(
        { $text: { $search: req.body.query } },
        { score: { $meta: 'textScore' } },
    ).sort({ score: { $meta: 'textScore' } })
        .then((result) => {
            res.json(result);
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const getCourseByTitle = (req, res) => {
    Course.find({
        $and: [{ department: req.params.department },
            { number: req.params.number }],
    }).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const createCourse = (req, res) => {
    Promise.resolve(courses.map((course) => {
        return Course.update(
            { $or: [{ name: course.title }, { crn: course.crn }] },
            {
                name: course.title,
                department: course.subject,
                number: course.number,
                section: course.section,
                crn: course.crn,
                professors: course.professors,
                enroll_limit: course.enrollment_limit,
                current_enrollment: course.current_enrollment,
                timeslot: course.period,
                room: course.room,
                building: course.building,
                description: course.description,
                term: course.term,
                wc: course.wc,
                distrib: course.distrib,
                links: course.links,
                related_courses: course.related_courses,
                terms_offered: course.terms_offered,
                layuplist_score: course.layuplist_score,
                layuplist_id: course.layuplist_id,
                medians: course.medians,
            }, { upsert: true },
        ).then((result) => {
            return result;
        }).catch((error) => {
            return error;
        });
    })).then(() => {
        res.status(200).json({ message: 'Courses successfully added to db 🚀' });
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const addFavorite = (req, res) => {
    User.findByIdAndUpdate(req.user.id, {
        $addToSet: { favorite_courses: req.params.id },
    }, { new: true }).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const removeFavorite = (req, res) => {
    User.findByIdAndUpdate(req.user.id, {
        $pull: { favorite_courses: req.params.id },
    }, { new: true }).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const getFavorite = (req, res) => {
    User.findOne({ _id: req.user.id })
        .populate({ path: 'favorite_courses', model: 'Course' })
        .exec()
        .then((result) => {
            res.json(result.favorite_courses);
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const addCompleted = (req, res) => {
    User.findByIdAndUpdate(req.user.id, {
        $push: { completed_courses: req.params.id },
    }, { new: true }).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const removeCompleted = (req, res) => {
    User.findByIdAndUpdate(req.user.id, {
        $pull: { completed_courses: req.params.id },
    }, { new: true }).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const getCompleted = (req, res) => {
    User.findOne({ _id: req.params.id })
        .populate({ path: 'completed_courses', model: 'Course' })
        .exec()
        .then((result) => {
            res.json(result.completed_courses);
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const CoursesController = {
    getCourses,
    getCourse,
    getCoursesByDepartment,
    getCoursesByDistrib,
    getCoursesByWC,
    getCourseByName,
    getCourseByTitle,
    createCourse,
    getFavorite,
    addFavorite,
    removeFavorite,
    addCompleted,
    removeCompleted,
    getCompleted,
};

export default CoursesController;
