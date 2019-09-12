import Course from '../models/course';
import Plan from '../models/plan';
import Term from '../models/term';
import User from '../models/user';
import Professor from '../models/professor';
import courses from '../../static/data/courses.json';
import departments from '../../static/data/departments.json';
import prerequisitesJSON from '../../static/data/prerequisites.json';
import { PopulateCourse, PopulateTerm } from './populators';


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
    if (!req.query.title) {
        Course.find({})
            .populate(PopulateCourse)
            .then((result) => {
                res.json(trim(result));
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error });
            });
        return;
    }
    const searchText = req.query.title;
    const query = Object.entries(req.query)
        .filter(([k, v]) => {
            if (k === 'department' && !departments.includes(v)) return false;
            if (k === 'number' && v.match(/\D+/) && v.match(/\D+/)[0] !== '.') return false;
            return v.length > 0 && k !== 'title';
        })
        .reduce((acc, [k, v]) => {
            acc[k] = v;
            return acc;
        }, {});
    if (query.department || query.number) {
        Course.find(query)
            .populate(PopulateCourse)
            .then((result) => {
                res.json(trim(result));
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error });
            });
    } else {
        const search = (searchText.includes(' ')) ? `"${searchText}"` : searchText;
        Course.find({ $text: { $search: search } })
            .populate(PopulateCourse)
            .then((result) => {
                res.json(trim(result));
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error });
            });
    }
};

const getCourses = async (req, res) => {
    // console.log('[course_controller] getCourses');
    Course.find({})
        .populate(PopulateCourse)
        .then((result) => {
            res.json(trim(result));
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const randomCourse = async (req, res) => {
    Course.count().then((count) => {
        const random = Math.floor(Math.random() * count);
        return Course.findOne().skip(random).populate(PopulateCourse);
    }).then((course) => {
        res.json(course);
    }).catch((e) => {
        res.status(500).json({ e });
    });
};

const getCourse = async (req, res) => {
    // console.log('[course_controller] getCourse');
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
    // console.log('[course_controller] getCoursesByDepartment');
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
    // console.log('[course_controller] getCoursesByDistrib');
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
    // console.log('[course_controller] getCoursesByWC');
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
    // console.log('[course_controller] getCoursesByName');
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
    // console.log('[course_controller] getCoursesByNumber');
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
        // Take `course` and find all it's xlisted courses
        xListed = course.xlist.map((xCourse) => {
            // xCourse is a layup_id
            return Course.findOne({ layup_id: xCourse })
                .then((linkedCourse) => {
                    if (linkedCourse) {
                        // Find the original course
                        Course.findOne({ layup_id: course.layup_id })
                            .then((origCourse) => {
                                if (origCourse) {
                                    // Update the linked course with the Original Courses ID, doubly link.
                                    Course.findByIdAndUpdate(
                                        linkedCourse._id,
                                        { $addToSet: { xlist: origCourse._id } },
                                    ).then((r) => { return console.log(r); }).catch((e) => { return console.log(e); });
                                    // console.log('Adding', origCourse.name, 'as an xlisted course for', linkedCourse.name);
                                }
                            });
                        // Return the linked course to set the xlisted for the original course
                        return linkedCourse._id;
                    }
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
                return Course.findByIdAndUpdate(res._id, { $addToSet: { xlist: { $each: xlist.flat() } } });
            }).then((res) => {
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

const [ERROR, WARNING, CLEAR] = ['error', 'warning', ''];

const getFulfilledStatus = (planID, termID, courseID, userID) => {
    // console.log('GETFULFILLEDSTATUS', userID);
    return User.findById(userID)
        .select('placement_courses')
        .then((user) => {
            if (!user) throw new Error('bad userID');
            return Plan.findById(planID)
                .populate({
                    path: 'terms',
                    populate: PopulateTerm,
                })
                .then((plan) => {
                    return Term.findById(termID).then((term) => {
                        const previousCourses = plan.terms.filter((t) => {
                            return t.index <= term.index;
                        }).map((t) => {
                            return t.previousCourses;
                        }).flat()
                            .map((t) => { return t.toString(); });
                        const prevCourses = [...new Set((user.placement_courses.length)
                            ? user.placement_courses.map((c) => { return c.toString(); }).concat(previousCourses)
                            : previousCourses)];

                        return Course.findById(courseID).populate(PopulateCourse)
                            .then((course) => {
                                // console.log(`Previous Courses for ${course.title}: ${prevCourses}`);
                                let prereqs = course.prerequisites ? course.prerequisites.toObject() : [];
                                if (!prereqs || prereqs.length === 0) {
                                    return CLEAR;
                                }
                                prereqs = prereqs.map((o) => {
                                    let dependencyType = Object.keys(o).find((key) => {
                                        return (o[key].length > 0 && key !== '_id');
                                    });
                                    if (!dependencyType && Object.keys(o).includes('abroad')) dependencyType = 'abroad';

                                    const prevCoursesIncludes = () => {
                                        return o[dependencyType].map((c) => { return c.id.toString(); })
                                            .some((id) => {
                                                return (prevCourses.length) ? prevCourses.includes(id) : false;
                                            });
                                    };

                                    switch (dependencyType) {
                                    case 'abroad':
                                        return WARNING;
                                    case 'req':
                                        return prevCoursesIncludes() ? CLEAR : ERROR;
                                    case 'range':
                                        return (prevCourses.some((c) => {
                                            return (o[dependencyType][0] <= c.number && c.number <= o[dependencyType][1] && c.department === this.course.department);
                                        })) ? CLEAR : ERROR;
                                    case 'grade':
                                        return prevCoursesIncludes() ? WARNING : ERROR;
                                    case 'rec':
                                        return prevCoursesIncludes() ? WARNING : ERROR;
                                    default:
                                        return CLEAR;
                                    }
                                });
                                if (prereqs.includes(ERROR)) {
                                    return ERROR;
                                }
                                if (prereqs.includes(WARNING)) {
                                    return WARNING;
                                }
                                return CLEAR;
                            });
                    });
                }).catch((error) => {
                    return { error };
                });
        });
};

const getFulfilledStatusTerm = (req, res) => {
    const { planID, termID, courseID } = req.params;
    Promise.resolve(getFulfilledStatus(planID, termID, courseID, req.user._id)).then((r) => {
        if ([ERROR, WARNING, CLEAR].includes(r)) {
            res.status(200).json(r);
        } else res.status(500).json(r);
    });
};

const getFulfilledStatusPlan = (req, res) => {
    const { planID, courseID } = req.params;
    Plan.findById(planID)
        .then((plan) => {
            Promise.all(plan.terms.map((term) => {
                return Promise.resolve(getFulfilledStatus(planID, term._id, courseID, req.user._id));
            }))
                .then((r) => {
                    res.json(r);
                });
        });
};

const CoursesController = {
    searchCourses,
    getCourses,
    getCourse,
    randomCourse,
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
    getFulfilledStatus,
    getFulfilledStatusTerm,
    getFulfilledStatusPlan,
};

export default CoursesController;
