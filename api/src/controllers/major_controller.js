import Major from '../models/major';
import User from '../models/user';
import cosc from '../../static/data/majors/cosc.json';

const seedMajors = (req, res) => {
    const major = new Major({
        name: cosc.name,
        department: cosc.department,
        link: cosc.link,
        requirements: { relationship: 'AND', requirements: cosc.requirements },
        students: [],
    });

    major.save().then((result) => {
        res.json(result);
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
    }, { new: true }).then((updatedUser) => {
        Major.findByIdAndUpdate(req.params.id, { $addToSet: { students: req.user.id } }, { new: true }).then((updatedMajor) => {
            res.send(`Major ${updatedMajor.name} declared for user ${updatedUser.id}`);
        });
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

const MajorController = {
    seedMajors,
    getMajor,
    getMajors,
    declareMajor,
    dropMajor,
    getDeclared,
};

export default MajorController;
