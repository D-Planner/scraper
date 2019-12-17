import Advisor from '../models/advisor';

// Find an advisor by email or create an account for one
const findOrCreateAdvisor = (req, res) => {
    const sentAdvisor = req.body.collectedInfo;
    console.log('sentAdvisor', sentAdvisor);
    Advisor.findOne({ email: sentAdvisor.email || sentAdvisor.mail }).then((advisor) => {
        console.log('found advisor', advisor);
        if (advisor === null) {
            const nameArray = (sentAdvisor.email || sentAdvisor.mail).split('@')[0].split('.');

            const newAdvisor = new Advisor({
                email: sentAdvisor.email || sentAdvisor.mail,
                first_name: nameArray[0].toUpperCase(),
                last_name: nameArray[nameArray.length - 1].toUpperCase(),
                full_name: sentAdvisor.displayName,
                department: sentAdvisor.dcDeptclass,
                college_affiliation: sentAdvisor.dcAffilitation,
                primary_affiliation: sentAdvisor.eduPersonPrimaryAffiliation,
                autocreated: true,
                claimed: false,
                account_created: Date.now(),
            });

            console.log('newAdvisor', newAdvisor);

            newAdvisor.save().then((savedAdvisor) => {
                console.log('savedAdvisor', savedAdvisor);
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

const advisorController = {
    findOrCreateAdvisor,
};

export default advisorController;
