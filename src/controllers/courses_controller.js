import Course from '../models/course';
import User from '../models/user';
import Professor from '../models/professor';
import courses from '../../static/data/courses.json';
import prerequisitesJSON from '../../static/data/prerequisites.json';
import { PopulateCourse } from './populators';

const trim = (res) => {
    try {
        return res.map((course) => {
            course.reviews.splice(20);
            return course;
        });
    } catch (e) {
        return res;
    }
};

const searchCourses = (req, res) => {
    const query = Object.entries(req.query)
        .filter(([k, v]) => {
            return v.length > 0;
        })
        .reduce((acc, [k, v]) => {
            acc[k] = v;
            return acc;
        }, {});
    Course.find(query)
        .populate(PopulateCourse)
        .then((result) => {
            res.json(trim(result));
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error });
        });
};

const getCourses = async (req, res) => {
    console.log('[course_controller] getCourses');
    Course.find({})
        .populate(PopulateCourse)
        .then((result) => {
            res.json(trim(result));
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const getCourse = async (req, res) => {
    console.log('[course_controller] getCourse');
    Course.findById(req.params.id)
        .populate(PopulateCourse)
        .then((result) => {
            res.json(trim(result));
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const getCoursesByDepartment = async (req, res) => {
    console.log('[course_controller] getCoursesByDepartment');
    Course.find({ department: req.params.department })
        .populate(PopulateCourse)
        .then((result) => {
            res.json(trim(result));
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const getCoursesByDistrib = (req, res) => { // needs to be updated since [distribs] is now an array
    console.log('[course_controller] getCoursesByDistrib');
    Course.find({ distribs: req.params.distrib })
        .populate(PopulateCourse)
        .then((result) => {
            res.json(trim(result));
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const getCoursesByWC = (req, res) => { // needs to be updated since [distribs] is now an array
    console.log('[course_controller] getCoursesByWC');
    Course.find({ wcs: req.params.wc })
        .populate(PopulateCourse)
        .then((result) => {
            res.json(trim(result));
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const getCourseByName = (req, res) => {
    console.log('[course_controller] getCoursesByName');
    Course.find(
        { $text: { $search: req.body.query } },
        { score: { $meta: 'textScore' } },
    ).sort({ score: { $meta: 'textScore' } })
        .populate(PopulateCourse)
        .then((result) => {
            res.json(trim(result));
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const getCourseByNumber = (req, res) => {
    console.log('[course_controller] getCoursesByNumber');
    Course.find({
        $and: [{ department: req.params.department },
            { number: req.params.number }],
    })
        .populate(PopulateCourse)
        .then((result) => {
            res.json(trim(result));
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const filledValues = (course) => {
    let professors = [];
    if (course.professors) {
        professors = course.professors.map((name) => {
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
    let prerequisites = [];
    if (prerequisitesJSON[course.title]) {
        prerequisites = prerequisitesJSON[course.title].map((o) => {
            const key = Object.keys(o)[0];
            const val = o[key];
            if (val) {
                if (key === 'abroad') {
                    console.log(course.title);
                    return Promise.resolve({ abroad: true });
                }
                const newVal = val.map((c) => {
                    const tokens = c.split(' ');
                    if (key === 'range') {
                        return parseInt(tokens[1]);
                    }
                    return Course.findOne({ department: tokens[0], number: tokens[1] })
                        .then((result) => {
                            if (result) return result._id;
                            return null;
                        })
                        .catch((error) => {
                            console.log('reseed', c);
                            return error;
                        });
                });
                return Promise.all(newVal)
                    .then((r) => {
                        return {
                            [key]: r,
                        };
                    }).catch((e) => {
                        return e;
                    });
            } else {
                return [];
            }
        });
    }
    let xListed = [];
    if (course.xlist) {
        xListed = course.xlist.map((c) => {
            return Course.findOne({ layup_id: c }).then((res) => {
                if (res) return res._id;
                return null;
            }).catch((err) => {
                console.log('reseed', err);
                return err;
            });
        });
    }
    return [
        Promise.all(xListed),
        Promise.all(prerequisites),
        Promise.all(professors),
    ];
};

const createCourse = (req, res) => {
    Promise.resolve(courses.map(async (course) => {
        Promise.all(filledValues(course)).then((r) => {
            // separates into [wcs] and [distribs]
            let wcs = []; let distribs = [];
            if (course.distribs != null) {
                wcs = course.distribs.filter((genEd) => { return (genEd === 'W' || genEd === 'NW' || genEd === 'CI'); });
                distribs = course.distribs.filter((genEd) => { return !wcs.includes(genEd); });
            }
            const [xlist, prerequisites, professors] = r;
            if (course.title === 'SPAN020: Writing and Reading: A Critical and Cultural Approach') console.log(prerequisites);
            return Course.findOneAndUpdate(
                { title: course.title },
                {
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
                    xlist,
                    name: course.name,
                    number: course.number,
                    periods: course.periods,
                    description: course.description,
                    reviews: course.reviews,
                    similar_courses: course.similar_courses,
                    orc_url: course.orc_url,
                    medians: course.medians,
                    terms_offered: course.terms_offered,
                    professors,
                    prerequisites,
                },
                { upsert: true },
            ).then((res) => {
                if (course.title === 'SPAN020: Writing and Reading: A Critical and Cultural Approach') console.log(res);
                return res;
            }).catch((error) => {
                return error;
            });
        }).catch((e) => {
            console.log(e);
        });
    })).then(() => {
        res.status(200).json({ message: 'Courses successfully added to db 🚀' });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ error });
    });
};

const addPlacement = (req, res) => {
    User.findByIdAndUpdate(req.user.id, {
        $addToSet: { placement_courses: req.params.id },
    }, { new: true }).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const removePlacement = (req, res) => {
    User.findByIdAndUpdate(req.user.id, {
        $pull: { placement_courses: req.params.id },
    }, { new: true }).then((result) => {
        res.json(result);
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
        .populate({
            path: 'favorite_courses',
            model: 'Course',
            populate: PopulateCourse,
        })
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
        .populate({
            path: 'completed_courses',
            model: 'Course',
            populate: PopulateCourse,
        })
        .then((result) => {
            res.json(result.completed_courses);
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const CoursesController = {
    searchCourses,
    getCourses,
    getCourse,
    getCoursesByDepartment,
    getCoursesByDistrib,
    getCoursesByWC,
    getCourseByName,
    getCourseByNumber,
    createCourse,
    addPlacement,
    removePlacement,
    getFavorite,
    addFavorite,
    removeFavorite,
    addCompleted,
    removeCompleted,
    getCompleted,
};

export default CoursesController;
