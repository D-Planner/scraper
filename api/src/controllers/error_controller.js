import Error from '../models/error';

/**
 * Logs an error from the frontend application.
 * @param {*} req
 * @param {*} res
 */
const logError = (req, res) => {
    const newError = new Error({
        source: req.body.source,
        user: req.user.id,
        data: req.body.message,
        time_stamp: Date.now(),
    });
    newError.save().then(() => {
        res.send('Error logged');
    }).catch((error) => {
        console.error(error);
        res.json({ error });
    });
};

/**
 * Returns all errors logged from clients.
 * @param {*} req
 * @param {*} res
 */
const getErrors = (req, res) => {
    try {
        Error.find({}).then((result) => {
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

const InterestsController = {
    logError,
    getErrors,
};

export default InterestsController;
