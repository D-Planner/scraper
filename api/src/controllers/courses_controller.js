import Course from '../models/course';
import User from '../models/user';
import Professor from '../models/professor';
import courses from '../../static/data/coursesWithPrerequisites.json';

const getCourses = async (req, res) => {
    Course.find({})
        .populate('professors')
        .then((result) => {
            res.json(result);
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const getCourse = async (req, res) => {
    Course.find({ _id: req.params.id })
        .populate('professors')
        .then((result) => {
            res.json(result);
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const getCoursesByDepartment = async (req, res) => {
    Course.find({ department: req.params.department })
        .populate('professors')
        .then((result) => {
            res.json(result);
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const getCoursesByDistrib = (req, res) => { // needs to be updated since [distribs] is now an array
    Course.find({ distribs: req.params.distrib })
        .populate('professors')
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
        .populate('professors')
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const getCourseByTitle = (req, res) => {
    Course.find({
        $and: [{ department: req.params.department },
            { number: req.params.number }],
    }).populate('professors')
        .then((response) => {
            res.json(response);
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const createCourse = (req, res) => {
    Promise.resolve(courses.map(async (course) => {
        let profs = [];
        if (course.professors) {
            profs = course.professors.map((name) => {
                const query = { name };
                const update = { name };
                const options = { upsert: true, new: true, setDefaultsOnInsert: true };

                // Find the document
                const res = Professor.findOneAndUpdate(query, update, options);
                return res.exec().then((r) => {
                    return r._id;
                });
            });
        }
        Promise.all(profs).then((r) => {
            return Course.create({
                layup_url: course.layup_url,
                layup_id: course.layup_id,
                title: course.title,
                department: course.department,
                offered: course.offered,
                distribs: course.distribs,
                total_reviews: course.total_reviews,
                quality_score: course.quality_score,
                layup_score: course.layup_score,
                xlist: course.xlist,
                name: course.name,
                number: course.number,
                periods: course.periods,
                description: course.description,
                reviews: course.reviews,
                similar_courses: course.similar_courses,
                orc_url: course.orc_url,
                medians: course.medians,
                terms_offered: course.terms_offered,
                professors: r,
                prerequisites: course.prerequisites,
            }).then((result) => {
                return result;
            }).catch((error) => {
                return error;
            });
        }).catch((e) => {
            return e;
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
