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
                        console.log('info message');
                        console.log(info);
                        res.json({ info });
                    }).catch((error) => {
                        console.log('error message');
                        console.error(error);
                        res.status(500).json(error);
                    });
                });
            };

            if (user.verificationKey === -1 || user.verificationKey === undefined) {
                console.log('setting verification key');
                setVerificationKey(req.body.userID).then((key) => {
                    console.log('key', key);
                    console.log('send verify email');
                    // generateVerificationEmail(req.body.userID).then((html) => {
                    //     sendEmail('adam.j.mcquilkin.22@dartmouth.edu', 'D-Planner says hi - with a button!', html);
                    // });
                    sendEmailWrapper();
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                console.log('not setting verification key');
                console.log('send verify email');
                // generateVerificationEmail(req.body.userID).then((html) => {
                //     sendEmail(user.email, 'D-Planner - Verify your email', html).then((info) => {
                //         console.log('info message');
                //         console.log(info);
                //         res.json({ info });
                //     }).catch((error) => {
                //         console.log('error message');
                //         console.error(error);
                //         res.status(500).json(error);
                //     });
                // });
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
