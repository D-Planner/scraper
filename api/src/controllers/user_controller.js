import jwt from 'jwt-simple';
import User from '../models/user';
import { PopulateCourse } from './populators';

export const signin = (req, res, next) => {
    const json = req.user.toJSON();
    delete json.password;
    res.send({ token: tokenForUser(req.user), user: json });
};

export const signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send('You must provide both an email and a password');
    }

    return User.findOne({ email }).then((user) => {
        if (user) {
            return res.status(409).send('User with this email already exists');
        }

        const newUser = new User({
            email,
            password,
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
    console.log(PopulateCourse);
    User.findById(userID)
        .populate({
            path: 'favorite_courses',
            populate: PopulateCourse,
        })
        .populate('placement_courses', 'department name number id')
        .populate('completed_courses', 'department name number id')
        .exec()
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


// encodes a new token for a user object
function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
