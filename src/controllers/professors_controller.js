import Professor from '../models/professor';

const getProfessors = (req, res) => {
    Professor.find({}).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const getProfessorId = async (name) => {
    const res = Professor.find({ name })
        .then((docs) => {
            try {
                return docs[0]._id;
            } catch (e) {
                return false;
            }
        });
    return res;
};

const getProfessorListId = async (profs) => {
    const list = [];
    if (profs && profs.length !== 0) {
        profs.forEach(async (pName) => {
            list.push(await getProfessorId(pName));
        });
    }
    return list;
};

const addProfessors = async (professors) => {
    if (professors && professors.length) {
        professors.forEach(async (name) => {
            const id = await getProfessorId(name);
            if (!id) {
                await Professor.create({ name }, (err, res) => {
                    if (err) console.log(err);
                });
            }
        });
    }
};

const getProfessorById = (req, res) => {
    Professor.find({ id: req.query.id }, 'name')
        .then((r) => {
            res.json(r);
        }).catch((e) => {
            res.status(500).json({ e });
        });
};


const ProfessorController = {
    getProfessors,
    addProfessors,
    getProfessorId,
    getProfessorListId,
    getProfessorById,
};

export default ProfessorController;
