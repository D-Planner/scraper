import User from '../models/user';
import { generateVerificationEmail, setVerificationKey, removeVerificationKey } from '../email/templates/verification';
import { sendEmail } from '../email';

const verifyEmail = (req, res) => {
    User.findById(req.body.userID).then((user) => {
        if (user.verificationKey === req.body.key && user.verificationKeyTimeout - Date.now() >= 0) {
            console.log('email verified!');
            user.emailVerified = true;
            user.save();
            removeVerificationKey(user._id);
            res.send({ emailVerified: true });
        } else {
            console.log('not verified');
            console.log(user.verificationKey, req.body.key);
            console.log((user.verificationKeyTimeout), Date.now());
            res.send({ emailVerified: false });
        }
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

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

            if (user.verificationKey === -1 || user.verificationKey === undefined || user.verificationKeyTimeout - Date.now() < 0) {
                setVerificationKey(req.body.userID).then((key) => {
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

const resetPassword = (req, res) => {

};

const VerifyController = {
    verifyEmail,
    sendVerifyEmail,
    resetPassword,
};

export default VerifyController;
