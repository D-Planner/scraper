import Major from '../models/major';

const uploadMajor = (req, res) => {
    const file = req.files.majors;
    const obj = JSON.parse(file.data.toString('ascii'));

    Promise.resolve(obj.map((major) => {
        return Major.create({
            name: major.name,
            department: major.department,
            link: major.link,
        });
    })).then(() => {
        res.status(200).json({ message: 'Major successfully added to db 🚀' });
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const getMajors = (req, res) => {
    Major.find({})
        .then((result) => {
            console.log(result);
            res.json(result);
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const MajorController = {
    uploadMajor,
    getMajors,
};

export default MajorController;
