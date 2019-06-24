import Course from '../models/course';
import User from '../models/user';
import ProfessorController from '../controllers/professors_controller';
import courses from '../../static/data/courses.json';

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

const getCoursesByWC = (req, res) => { // needs to be updated since [distribs] is now an array
    Course.find({ wcs: req.params.wc })
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

const getCourseByNumber = (req, res) => {
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
        await ProfessorController.addProfessors(course.professors);
        const profs = await ProfessorController.getProfessorListId(course.professors);
        // separates into [wcs] and [distribs]
        let wcs = []; let distribs = [];
        if (course.distribs != null) {
            wcs = course.distribs.filter((genEd) => { return (genEd === 'W' || genEd === 'NW' || genEd === 'CI'); });
            distribs = course.distribs.filter((genEd) => { return !wcs.includes(genEd); });
        }
        return Course.create({
            layup_url: course.layup_url,
            layup_id: course.layup_id,
            title: course.title,
            department: course.department,
            offered: course.offered,
            distribs,
            wcs,
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
            professors: profs,
        }).then((result) => {
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
    getCourseByNumber,
    createCourse,
    getFavorite,
    addFavorite,
    removeFavorite,
    addCompleted,
    removeCompleted,
    getCompleted,
};

export default CoursesController;
