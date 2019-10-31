import User from '../models/user';
import { removeVerificationKey } from '../email/templates/verification';

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

const resetPassword = (req, res) => {

};

const VerifyController = {
    verifyEmail,
    resetPassword,
};

export default VerifyController;
