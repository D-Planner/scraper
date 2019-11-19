import passport from 'passport';
import LocalStrategy from 'passport-local';
import dotenv from 'dotenv';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import User from '../models/user';

// options for local strategy, we'll use email AS the username
// not have separate ones
const localOptions = { usernameField: 'NetID' };

dotenv.config({ silent: true });

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.AUTH_SECRET,
};

// username + password authentication strategy
const localLogin = new LocalStrategy(localOptions, (netID, password, done) => {
    if (!netID || !password) {
        return done(new Error('You must provide an email and password'));
    }
    // should find user by email and check password
    // Verify this email and password, call done with the user
    // if it is the correct email and password
    // otherwise, call done with false


    // return User.findOne({ email }, (err, user) => {
    return User.findOne({ netID }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }

        // compare passwords - is `password` equal to user.password?
        return user.comparePassword(password, (err, isMatch) => {
            if (err) {
                done(err);
            } else if (!isMatch) {
                done(null, false);
            } else {
                done(null, user);
            }
        });
    });
});

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    // See if the user ID in the payload exists in our database
    // If it does, call 'done' with that other
    // otherwise, call done without a user object
    User.findById(payload.sub, (err, user) => {
        if (err) {
            done(err, false);
        } else if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);


export const requireAuth = passport.authenticate('jwt', { session: false });
export const requireSignin = passport.authenticate('local', { session: false });

