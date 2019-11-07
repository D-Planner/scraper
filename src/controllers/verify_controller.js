import User from '../models/user';
import { generateVerificationEmail, generateResetPassEmail, setVerificationKey } from '../email/templates/verification';
import { sendEmail } from '../email';


const verifyEmail = (req, res) => {
    User.findById(req.body.userID).then((user) => {
        if (user.emailVerificationKey === req.body.key && user.emailVerificationKeyTimeout - Date.now() >= 0) {
            console.log('email verified!');

            user.emailVerified = true;
            user.emailVerificationKey = '-1';
            user.emailVerificationKeyTimeout = -1;
            user.save().then(() => {
                res.send({ emailVerified: true });
            });
        } else {
            console.log('not verified');
            console.log(user.emailVerificationKey, req.body.key);
            console.log((user.emailVerificationKeyTimeout), Date.now());
            res.send({ emailVerified: false });
        }
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

/**
 * Send an email with a link for email verification
 * @param {*} req
 * @param {*} res
 */
const sendVerifyEmail = (req, res) => {
    User.findById(req.body.userID).then((user) => {
        if (user.emailVerified === false) {
            const sendEmailWrapper = () => {
                generateVerificationEmail(req.body.userID).then((html) => {
                    sendEmail(user.email, 'D-Planner - Verify your email', html).then((info) => {
                        res.json({ info });
                    }).catch((error) => {
                        res.status(500).json(error);
                    });
                });
            };

            if (user.emailVerificationKey === -1 || user.emailVerificationKey === undefined || user.emailVerificationKeyTimeout - Date.now() < 0 || user.emailVerificationKeyTimeout === -1) {
                setVerificationKey(req.body.userID, 'e').then((key) => {
                    sendEmailWrapper();
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                sendEmailWrapper();
            }
        }
    }).catch((error) => {
        console.error(error);
    });
};

/**
 * Returns whether or not a password reset should be authorized on the frontend
 * @param {*} req
 * @param {*} res
 */
const authResetPass = (req, res) => {
    User.findById(req.body.userID).then((user) => {
        if (user.passwordVerificationKey === req.body.key && user.passwordVerificationKeyTimeout - Date.now() >= 0) {
            console.log(`password reset authenticated with key ${user.passwordVerificationKey}`);
            res.send({ passResetAuthorized: true });
        } else {
            console.log('not verified');
            console.log(user.emailVerificationKey, req.body.key);
            console.log((user.emailVerificationKeyTimeout), Date.now());
            res.send({ passResetAuthorized: false });
        }
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

/**
 * Takes in password, updates user and removes update keys
 * @param {*} req
 * @param {*} res
 */
const resetPass = (req, res) => {
    User.findById(req.body.userID).then((user) => {
        if (req.body.key === user.passwordVerificationKey) {
            console.log('password reset keys equal');
            user.password = req.body.pass;
            user.passwordVerificationKey = '-1';
            user.passwordVerificationKeyTimeout = -1;
            user.save().then(() => {
                const json = user.toJSON();
                delete json.password;
                res.json(json);
            }).catch((error) => {
                console.error(error);
                res.json({ error });
            });
        } else {
            console.log('password reset keys not equal');
        }
    }).catch((error) => {
        res.json({ error });
    });
};

/**
 * Sends password reset email through GMAIL servers
 * @param {*} req
 * @param {*} res
 */
const sendResetPass = (req, res) => {
    User.findById(req.body.userID).then((user) => {
        const sendEmailWrapper = () => {
            generateResetPassEmail(req.body.userID).then((html) => {
                sendEmail(user.email, 'D-Planner - Reset your password', html)
                    .then((info) => {
                        res.send({ info });
                    }).catch((error) => {
                        res.send({ error });
                    });
            }).catch((error) => {
                console.log(error);
                res.json({ error });
            });
        };

        if (user.passwordVerificationKey === -1 || user.passwordVerificationKey === undefined || user.passwordVerificationKeyTimeout - Date.now() < 0) {
            setVerificationKey(req.body.userID, 'p').then((key) => {
                sendEmailWrapper();
            }).catch((error) => {
                console.error(error);
            });
        } else {
            sendEmailWrapper();
        }
    }).catch((error) => {
        console.error(error);
    });
};

/**
 * Allows user to send password reset email to entered email
 * @param {*} req
 * @param {*} res
 */
const resetPassByEmail = (req, res) => {
    User.find({ email: req.body.email }).then((users) => {
        if (users.length === 1) {
            const userID = users[0]._id;
            sendResetPass({
                body: {
                    userID,
                },
            }, res);
        }
    });
};

/**
 * Gets the specified user based on a URL parameter
 * @param {*} req
 * @param {*} res
 */
const getUserByKey = (req, res) => {
    // console.log(req.query);
    User.find({ passwordVerificationKey: req.query.key }).then((users) => {
        console.log(users);
        if (users.length === 1) {
            res.send(users[0]);
        } else {
            console.log('couldn\'t find user');
            res.status(500);
        }
    }).catch((error) => {
        console.log(error);
        // res.send(error);
    });
};

const VerifyController = {
    verifyEmail,
    sendVerifyEmail,
    authResetPass,
    sendResetPass,
    resetPass,
    resetPassByEmail,
    getUserByKey,
};

export default VerifyController;
