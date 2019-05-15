import Major from '../models/major';
import User from '../models/user';

const uploadMajor = (req, res) => {
    const file = req.files.majors;
    const obj = JSON.parse(file.data.toString('ascii'));

    Promise.resolve(Major.create({
        name: obj.name,
        department: obj.department,
        link: obj.link,
        requirements: obj.requirements,
    }).then((result) => {
        res.json({ message: `🎓 Major ${result._id} created` });
    }).catch((error) => {
        res.status(500).json({ error });
    }));
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

const MajorController = {
    uploadMajor,
    getMajor,
    getMajors,
    declareMajor,
    dropMajor,
    getDeclared,
};

export default MajorController;
