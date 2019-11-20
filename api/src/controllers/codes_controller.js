import rand from 'generate-key';
import { tokenForUser } from './user_controller';
import Auth from '../models/auth';
import User from '../models/user';

const accessCodeKey = 'E193D58E186DD1E567E4BEE6BFE32';
const accessCodeLength = 8;
const timeoutDuration = 720000; // Two hours

// Generates a new access code
const generateAccessCode = (req, res) => {
    // Verify access to system
    if (req.headers.key === accessCodeKey) {
        const newAuth = new Auth({
            code: rand.generateKey(accessCodeLength),
            timeout: Date.now() + timeoutDuration,
            name: req.body.name,
            email: req.body.email,
        });

        newAuth.save().then((savedAuth) => {
            res.json(savedAuth);
        }).catch((error) => {
            res.json({ error });
        });
    } else {
        res.status(401).send('Unauthorized');
    }
};

// Removes a single access code
const removeAccessCode = (req, res) => {
    if (req.headers.key === accessCodeKey) {
        Auth.findById(req.body.id).remove();
        res.send('Removed Access Code 🚀');
    }
};

// Checks if an access code is valid
const verifyAccessCode = (req, res) => {
    Auth.findOne({ code: req.query.code }).then((code) => {
        if (code) {
            if (code.timeout - Date.now() < 0) {
                code.remove();
                res.status(403).send('Code timed out');
            }
            User.findOne({ email: code.email }).then((user) => {
                if (user) {
                    user.accessGranted = true;
                    user.save().then((savedUser) => {
                        code.remove();
                        res.send({ token: tokenForUser(user) });
                    });
                } else {
                    res.status(400).send('Code has no associated email: please contact code provider');
                }
            }).catch((error) => {
                console.log(error);
                res.status(500).json('Could not authenticate user');
            });
        } else {
            res.status(401).send('Invalid authentication code');
        }
    }).catch((error) => {
        res.json({ error });
    });
};

// Gets all access codes
const getAccessCodes = (req, res) => {
    if (req.headers.key === accessCodeKey) {
        Auth.find({}).then((codes) => {
            res.send(codes);
        });
    } else {
        res.status(401).send('Unauthorized');
    }
};

// Removes all access codes
const removeAccessCodes = (req, res) => {
    if (req.headers.key === accessCodeKey) {
        Auth.find({}).then((codes) => {
            codes.map((c) => { return c.remove(); });
        });
        res.send('Removed all access codes 🚀');
    } else {
        res.status(401).send('Unauthorized');
    }
};

const authController = {
    verifyAccessCode,
    generateAccessCode,
    removeAccessCode,
    getAccessCodes,
    removeAccessCodes,
};

export default authController;
