import Major from '../models/major';
import User from '../models/user';

const uploadMajor = (req, res) => {
    const obj = JSON.parse(req.body);

    const major = new Major({
        name: obj.name,
        department: obj.department,
        link: obj.link,
        requirements: obj.requirements,
    });

    major.save().then((result) => {
        res.json({ message: `🎓 Major ${result._id} created` });
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const getMajor = (req, res) => {
    Major.find({ _id: req.params.id })
        .then((result) => {
            res.json(result);
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const getMajors = (req, res) => {
    Major.find({})
        .then((result) => {
            res.json(result);
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const declareMajor = (req, res) => {
    User.findByIdAndUpdate(req.user.id, {
        $addToSet: { majors: req.params.id },
    }, { new: true }).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const dropMajor = (req, res) => {
    User.findByIdAndUpdate(req.user.id, {
        $pull: { majors: req.params.id },
    }, { new: true }).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const getDeclared = (req, res) => {
    User.findById(req.user.id)
        .populate({ path: 'majors', model: 'Major' })
        .exec()
        .then((result) => {
            res.json(result.majors);
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const getProgress = (req, res) => {
    Major.findOne({ _id: req.params.id })
        .populate()
        .select('requirements')
        .exec()
        .then((result) => {
            let fulfilled = 0;
            const fullfilledCourses = [];
            let unfulfilled = 0;
            const unfulfilledCourses = [];
            result.requirements.forEach((requirement) => {
                if (requirement.options.some((r) => {
                    return req.user.completed_courses.indexOf(r) >= 0;
                })) {
                    fulfilled += 1;
                    fullfilledCourses.push(requirement.options);
                } else {
                    unfulfilled += 1;
                    unfulfilledCourses.push(requirement.options);
                }
            });
            res.json({
                fulfilled: { total: fulfilled, courses: fullfilledCourses },
                unfulfilled: { total: unfulfilled, courses: unfulfilledCourses },
            });
        });
};

const MajorController = {
    uploadMajor,
    getMajor,
    getMajors,
    declareMajor,
    dropMajor,
    getDeclared,
    getProgress,
};

export default MajorController;
