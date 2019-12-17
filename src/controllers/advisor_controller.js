import Advisor from '../models/advisor';

// Find an advisor by email or create an account for one
const findOrCreateAdvisor = (req, res) => {
    const sentAdvisor = req.body.collectedInfo;
    Advisor.findOne({ email: sentAdvisor.email || sentAdvisor.mail }).then((advisor) => {
        if (advisor === null) {
            const nameArray = sentAdvisor.displayName.split(' ');

            const newAdvisor = new Advisor({
                email: sentAdvisor.email || sentAdvisor.mail,
                first_name: nameArray[0],
                last_name: nameArray[nameArray.length - 1],
                full_name: sentAdvisor.displayName,
                department: sentAdvisor.dcDeptclass,
                college_affiliation: sentAdvisor.dcAffilitation,
                primary_affiliation: sentAdvisor.eduPersonPrimaryAffiliation,
                autocreated: true,
                claimed: false,
                account_created: Date.now(),
            });

            newAdvisor.save().then((savedAdvisor) => {
                res.send(savedAdvisor._id);
            }).catch((error) => {
                console.error(error);
                res.status(500).json({ error });
            });
        } else {
            res.send(advisor._id);
        }
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

// Returns advisor object based on passed id
const getAdvisor = (req, res) => {
    Advisor.findById(req.params.id).then((advisor) => {
        const json = advisor.toJSON();
        delete json.settings;
        delete json.password;
        delete json.advisees;
        return res.send(json);
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const advisorController = {
    findOrCreateAdvisor,
    getAdvisor,
};

export default advisorController;
