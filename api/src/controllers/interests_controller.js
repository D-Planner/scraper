import interestsJSON from '../../static/data/interests.json';
import Interest from '../models/interest';
import User from '../models/user';

/**
 * Loads interests into DB from JSON file
 * @param {*} req
 * @param {*} res
 */
const seedInterests = (req, res) => {
    Promise.resolve(interestsJSON.map(async (interest) => {
        const newInterest = new Interest({
            name: interest.name,
            departments: interest.departments,
            campus_resources: interest.campus_resources,
            sub_interests: interest.sub_interests,
        });

        return newInterest.save();
    })).then(() => {
        res.json({ message: 'Interests successfully added to db 🚀' });
    }).catch((error) => {
        console.error(error);
        res.json({ error });
    });
};

/**
 * Send all interests to frontend from DB
 * @param {*} req
 * @param {*} res
 */
const getInterests = (req, res) => {
    try {
        Interest.find({}).then((result) => {
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

const updateUserInterest = (req, res) => {
    User.findById(req.body.userID).then((user) => {
        console.log(user);
        res.json(user);
    });
};

const InterestsController = {
    seedInterests,
    getInterests,
    updateUserInterest,
};

export default InterestsController;
