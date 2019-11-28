import jwt from 'jwt-simple';
import User from '../models/user';
import Plan from '../models/plan';
import { PopulateUser } from './populators';

// Does a user exist with the given email?
export const checkUserByEmail = (req, res) => {
    User.findOne({ email: req.query.email }).then((user) => {
        if (user) {
            res.send(true);
        } else {
            res.send(false);
        }
    }).catch((error) => {
        res.send({ error });
    });
};

export const signin = (req, res, next) => {
    if (req.user.accessGranted === false) {
        // Pre-release signup
        res.status(403).send('Account not yet authorized: pre-release sign up');
    } else {
        // Authorized user
        const json = req.user.toJSON();
        delete json.password;
        res.send({ token: tokenForUser(req.user), user: json });
    }
};

export const signup = (req, res, next) => {
    const {
        email, password, firstName, lastName, college, grad,
    } = req.body;

    return User.findOne({ email }).then((user) => {
        if (user) {
            return res.status(409).send('Email already registered to a user');
        }

        if (!email || !password) {
            return res.status(409).send('Please fill all required fields (*)');
        }

        const newUser = new User({
            email,
            password,
            firstName,
            lastName,
            university: college,
            graduationYear: grad,
            emailVerified: false,
            accessGranted: false,
        });

        return newUser.save().then((savedUser) => {
            const json = savedUser.toJSON();
            delete json.password;
            res.send({ token: tokenForUser(savedUser), user: json });
        }).catch((err) => {
            next(err);
        });
    }).catch((err) => {
        next(err);
    });

// 🚀 TODO:
// here you should do a mongo query to find if a user already exists with this email.
// if user exists then return an error. If not, use the User model to create a new user.
// Save the new User object
// this is similar to how you created a Post
// and then return a token same as you did in in signin
};

export const getUser = (req, res) => {
    let userID;
    if (req.params.id) {
        userID = req.params.id;
    } else {
        userID = req.user.id;
    }
    User.findById(userID)
        .populate(PopulateUser)
        .then((user) => {
            const json = user.toJSON();
            delete json.password;
            res.json(json);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error });
        });
};

/**
 * 🚀 TODO:
 * Check if there are security vulnerabilities created by sending user key to
 * frontend for validation, add as backend functionality
 */

export const updateUser = async (req, res) => {
    User.findById(req.user.id)
        .populate(PopulateUser)
        .then((user) => {
            if (user.graduationYear !== req.body.change.graduationYear) {
                console.log('deleting all plans...');
                Plan.find({ user_id: user._id }).remove().exec();
            }
            user.fullName = req.body.change.fullName;
            user.firstName = req.body.change.firstName;
            user.lastName = req.body.change.lastName;
            user.email = req.body.change.email;
            user.graduationYear = req.body.change.graduationYear;
            user.emailVerified = req.body.change.emailVerified;

            // For managing adding and removing elements from interest profile
            if (user.interest_profile.indexOf(req.body.change.interest_profile) !== -1) {
                user.interest_profile.pull(req.body.change.interest_profile);
            } else {
                user.interest_profile.addToSet(req.body.change.interest_profile);
            }

            // Force user to re-verify on email change
            if (req.body.change.email && req.body.change.email !== user.email) {
                console.log('unverifying email');
                user.emailVerified = false;
            }
            user.email = req.body.change.email; // Keep this after email update check

            // Don't reset password if none in request
            if (req.body.change.password) { user.password = req.body.change.password; }

            user.save();
            const json = user.toJSON();
            delete json.password;
            res.json(json);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error });
        });
};

// Deletes user from DB
export const deleteUser = (req, res) => {
    User.findById(req.user.id)
        .remove(() => { return console.log(`removed user with id ${req.user.id}`); })
        .then(() => {
            res.send('User removed 🚀');
        })
        .catch((error) => {
            console.error(error);
            res.send(error);
        });
};


// encodes a new token for a user object
export function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
