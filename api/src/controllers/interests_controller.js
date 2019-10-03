import interestsJSON from '../../static/data/interests.json';

const getInterests = (req, res) => {
    try {
        console.log(interestsJSON);
        res.json(interestsJSON);
    } catch (e) {
        res.status(500).json({ e });
        console.log(e);
    }
};

const InterestsController = {
    getInterests,
};

export default InterestsController;
