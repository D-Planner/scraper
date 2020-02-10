import jwt from 'jwt-simple';
import User from '../models/user';
import Plan from '../models/plan';
import Interest from '../models/interest';
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
    // if (req.user.accessGranted === false) {
    //     // Pre-release signup
    //     res.status(403).send('Account not yet authorized: pre-release sign up');
    // } else {
    // Authorized user
    const json = req.user.toJSON();
    delete json.password;
    res.send({ token: tokenForUser(req.user), user: json });
    // }
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
            email: email.toLowerCase(), // For verification against later in known form
            password,
            firstName,
            lastName,
            university: college,
            graduationYear: grad,
            emailVerified: false,
            accessGranted: true,
            accountCreated: Date.now(),
            tc_accepted: false,
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
            // Check if any keys have expired (email, password)
            new Promise((resolve, reject) => {
                if (user.emailVerificationKeyTimeout - Date.now() < 0) {
                    user.emailVerificationKeyTimeout = -1;
                    user.emailVerificationKey = -1;
                    user.save().then(() => {
                        resolve();
                    });
                } else if (user.passwordVerificationKeyTimeout - Date.now() < 0) {
                    user.passwordVerificationKeyTimeout = -1;
                    user.passwordVerificationKey = -1;
                    user.save().then(() => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            }).then(() => {
                new Promise((resolve, reject) => {
                    user.totalFetchUserCalls += 1;
                    user.save().then(() => {
                        resolve();
                    });
                }).then(() => {
                    const json = user.toJSON();
                    delete json.password;
                    res.json(json);
                });
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error });
        });
};

/**
 * Get filled-out user interest objects
 * @param {*} req
 * @param {*} res
 */
export const getUserInterests = (req, res) => {
    User.findById(req.params.id).then((user) => {
        const userInterests = [];
        Promise.all(user.interest_profile.map((interestID) => {
            return Interest.findById(interestID).then((interest) => {
                userInterests.push(interest);
            }).catch((error) => {
                console.error(error);
                res.status(500).json({ error });
            });
        })).then(() => {
            res.send(userInterests);
        });
    })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error });
        });
};

/**
 * Add all possible interests to user interest_profile
 * @param {*} req
 * @param {*} res
 */
export const addAllUserInterests = (req, res) => {
    User.findById(req.params.id).then((user) => {
        user.interest_profile = [];
        Interest.find({}).then((interests) => {
            interests.map((interest) => {
                user.interest_profile.push(interest._id);
                return null;
            });
            user.save().then((savedUser) => {
                res.send(savedUser);
            });
        });
    }).catch((error) => {
        console.error(error);
        res.status(500).json({ error });
    });
};

/**
 * Remove all interests from user interest_profile
 * @param {*} req
 * @param {*} res
 */
export const removeAllUserInterests = (req, res) => {
    User.findById(req.params.id).then((user) => {
        user.interest_profile = [];
        user.save().then((savedUser) => {
            res.send(savedUser);
        });
    }).catch((error) => {
        console.error(error);
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
            if (req.body.change.graduationYear && user.graduationYear !== req.body.change.graduationYear) {
                user.graduationYear = req.body.change.graduationYear;
                Plan.find({ user_id: user._id }).deleteMany().exec()
                    .catch((error) => {
                        console.error(error);
                    });
            }

            if (req.body.change.fullName) { user.fullName = req.body.change.fullName; }
            if (req.body.change.firstName) { user.firstName = req.body.change.firstName; }
            if (req.body.change.lastName) { user.lastName = req.body.change.lastName; }
            if (req.body.change.email) { user.email = req.body.change.email.toLowerCase(); }
            if (req.body.change.emailVerified) { user.emailVerified = req.body.change.emailVerified; }

            // Set terms and conditions accepted
            if (req.body.change.tc_accepted !== undefined) {
                user.tc_accepted = req.body.change.tc_accepted;
                if (req.body.change.tc_accepted === true) {
                    user.tc_accepted_date = Date.now();
                } else if (req.body.change.tc_accepted === false) {
                    user.tc_accepted_date = -1;
                }
            }

            // For managing adding and removing elements from interest profile
            if (req.body.change.interest_profile) {
                if (user.interest_profile.indexOf(req.body.change.interest_profile) !== -1) {
                    user.interest_profile.pull(req.body.change.interest_profile);
                } else {
                    user.interest_profile.addToSet(req.body.change.interest_profile);
                }
            }

            // For managing adding and removing elements from AP profile based on filled objects
            if (req.body.change.ap_profile) {
                let found = false;
                let foundIndex = -1;

                user.ap_profile.forEach((item, index) => {
                    if (found === false && item._id.toString() === req.body.change.ap_profile) {
                        found = true;
                        foundIndex = index;
                    }
                });
                if (found === true) {
                    user.ap_profile.splice(foundIndex, 1);
                } else {
                    user.ap_profile.addToSet(req.body.change.ap_profile);
                }
            }

            // For managing adding and removing elements from advisor elements
            if (req.body.change.dean !== undefined) {
                if (req.body.change.dean === null) {
                    user.dean = undefined;
                    user.markModified('dean');
                } else {
                    user.dean = req.body.change.dean;
                }
            }
            if (req.body.change.faculty_advisor !== undefined) {
                if (req.body.change.faculty_advisor === null) {
                    user.faculty_advisor = undefined;
                    user.markModified('faculty_advisor');
                } else {
                    user.faculty_advisor = req.body.change.faculty_advisor;
                }
            }

            // For managing adding and removing elements from other_advisors based on filled objects
            if (req.body.change.other_advisor) {
                let found = false;
                let foundIndex = -1;

                user.other_advisors.forEach((item, index) => {
                    if (found === false && item._id.toString() === req.body.change.other_advisor) {
                        found = true;
                        foundIndex = index;
                    }
                });
                if (found === true) {
                    user.other_advisors.splice(foundIndex, 1);
                } else {
                    user.other_advisors.addToSet(req.body.change.other_advisor);
                }
            }

            if (req.body.change.fullName) user.fullName = req.body.change.fullName;
            if (req.body.change.firstName) user.firstName = req.body.change.firstName;
            if (req.body.change.lastName) user.lastName = req.body.change.lastName;
            // if (req.body.change.email) user.email = req.body.change.email;
            if (req.body.change.graduationYear) user.graduationYear = req.body.change.graduationYear;

            if (req.body.change.viewed_announcements) {
                if (user.viewed_announcements.indexOf(req.body.change.viewed_announcements) === -1) {
                    user.viewed_announcements.push(req.body.change.viewed_announcements);
                } else {
                    user.viewed_announcements.pull(req.body.change.viewed_announcements);
                }
            }
            if (req.body.change.emailVerified) user.emailVerified = req.body.change.emailVerified;

            // Force user to re-verify on email change
            if (req.body.change.email) {
                if (req.body.change.email !== user.email) {
                    user.emailVerified = false;
                }
                user.email = req.body.change.email; // Keep this after email update check
            }

            // Don't reset password if none in request
            if (req.body.change.password) { user.password = req.body.change.password; }

            user.save().then((newUser) => {
                const json = newUser.populate(PopulateUser).toJSON();
                delete json.password;
                res.send(json);
            }).catch((error) => {
                console.error(error);
            });
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
