import Professor from '../models/professor';

const getProfessors = (req, res) => {
    Professor.find({}).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const getProfessorById = (req, res) => {
    Professor.findById(req.params.id)
        .then((r) => {
            res.json(r);
        }).catch((e) => {
            res.status(500).json({ e });
        });
};


const ProfessorController = {
    getProfessors,
    getProfessorById,
};

export default ProfessorController;