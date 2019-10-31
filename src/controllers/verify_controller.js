import User from '../models/user';

const verifyEmail = (req, res) => {
    console.log('verify email');
    // console.log(req.body);
    User.findById(req.body.userID).then((user) => {
        if (user.verificationKey === req.body.key && user.verificationKeyTimeout - Date.now() >= 0) {
            console.log('email verified!');
            res.send({ emailVerified: true });
        } else {
            console.log('not verified');
            console.log('subtracted keys', user.verificationKey - req.body.key);
            console.log('time remaining (ms)', (user.verificationKeyTimeout) - Date.now());
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
