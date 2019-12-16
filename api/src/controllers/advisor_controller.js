import Advisor from '../models/advisor';

// Find an advisor by email or create an account for one
const findOrCreateAdvisor = (req, res) => {
    console.log(req.body);
    Advisor.findOne({ email: req.body.email }).then((advisor) => {
        console.log('found advisor', advisor);
        if (advisor === null) {
            const nameArray = req.body.email.split('@')[0].split('.');
            console.log('nameArray', nameArray);

            const newAdvisor = new Advisor({
                email: req.body.email,
                first_name: nameArray[0],
                last_name: nameArray[1],
                autocreated: true,
                account_created: Date.now(),
            });

            newAdvisor.save().then((savedAdvisor) => {
                // const json = savedAdvisor.toJSON();
                // delete json.settings;
                // delete json.advisees;
                // delete json.account_claimed;
                console.log(savedAdvisor);
                res.send(savedAdvisor._id);
            }).catch((error) => {
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
