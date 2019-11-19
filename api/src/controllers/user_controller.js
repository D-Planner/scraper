import JWT from 'jwt-simple';
import axios from 'axios';
import dotenv from 'dotenv';
import User from '../models/user';
import Plan from '../models/plan';
import { PopulateUser } from './populators';

dotenv.config({ silent: true });

export const signin = (req, res, next) => {
    const json = req.user.toJSON();
    delete json.password;
    res.send({ token: tokenForUser(req.user), user: json });
};

// Send token to user
export const signinheadless = (req, res, next) => {
    res.send({ token: tokenForUser(req.body.user) });
};

// Verify netID with Dartmouth
const verifyUserCAS = (netID) => {
// Get JWT key form Dartmouth API
    return new Promise((resolve, reject) => {
        axios.post('https://api.dartmouth.edu/api/jwt?scope=urn', {}, { headers: { Authorization: process.env.DARTMOUTH_API_KEY } })
            .then((response) => {
            // Check netID against Dartmouth server
                axios.get(`https://api.dartmouth.edu/api/students/${netID}`, { headers: { Authorization: `Bearer ${response.data.jwt}` } })
                    .then((r) => {
                        if (r.data.netid === netID) {
                            resolve(netID);
                        } else {
                            reject(new Error('NetID not verified!'));
                        }
                    }).catch((error) => {
                        reject(error);
                    });
            }).catch((error) => {
                reject(error);
            });
    });
};

export const signup = (netid, password, gradYear) => {
    return new Promise((resolve, reject) => {
        // TODO: Generate email, college, fullname

        verifyUserCAS(netid)
            .then((response) => {
                User.findOne({ netID: response }).then((user) => {
                    if (user) {
                        reject(new Error(`NetID '${response}' already associated with user`));
                    } else {
                        const newUser = new User({
                            email: `${response}@dartmouth.edu`,
                            password,
                            netID: response,

                            // TODO: COnnect these to CAS

                            // university: college,
                            // first_name: fullName.split(' ')[0],
                            // last_name: fullName.split(' ')[2],
                            graduationYear: gradYear,
                        });

                        // if (user) {
                        //     const json = user.toJSON();
                        //     delete json.password;
                        //     resolve({ token: tokenForUser(user), user: json });
                        // }

                        newUser.save().then((savedUser) => {
                            const json = savedUser.toJSON();
                            delete json.password;
                            resolve({ token: tokenForUser(savedUser), user: json });
                        }).catch((error) => {
                            reject(error);
                        });
                    }
                }).catch((error) => {
                    if (error.response.status === 404) {
                        reject(new Error(`Could not verify NetID '${netid}'`));
                    }
                    reject(error);
                });
            }).catch((error) => {
                if (error.response.status === 404) {
                    reject(new Error(`Could not verify NetID '${netid}'`));
                }
                reject(error);
            });
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
function tokenForUser(user) {
    console.log('user token', user);
    const timestamp = new Date().getTime();
    return JWT.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
