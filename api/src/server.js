import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import CASAuthentication from 'cas-authentication';

import { requireAuth } from './authentication/init';
import { authRouter, plansRouter, coursesRouter, termsRouter, majorsRouter, professorsRouter, globalRouter } from './routes';

require('dotenv').config();

// initialize
const app = express();
const passport = require('passport');

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want static assets from folder static
app.use(express.static('static'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure passport with express-sessions
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// enable file uploads
app.use(fileUpload());

const port = process.env.PORT || 9090;
app.listen(port);
console.log(`listening on: ${port}`);

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/dplanner';
const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    loggerLevel: 'error',
};
mongoose.connect(mongoURI, mongooseOptions).then(() => {
    console.log('Connected to Database');
}).catch((err) => {
    console.log('Not Connected to Database ERROR! ', err);
});

const resetDB = () => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => {
            mongoose.connect(mongoURI);
        });
    });
};

// Set up an Express session, which is required for CASAuthentication.
app.use(session({
    secret: 'super secret key',
    resave: false,
    saveUninitialized: true,
}));

// Create a new instance of CASAuthentication.
const cas = new CASAuthentication({
    cas_url: 'https://login.dartmouth.edu/cas',
    service_url: 'http://localhost:9090', // TODO: Change this based on host
    session_info: true,
});

// Unauthenticated clients will be redirected to the CAS login and then back to this route once authenticated.
app.get('/auth/cas', cas.bounce, (req, res) => {
    console.log(req.session.true.affil, req.session.true.netid, req.session.true.name);
    // TODO: Log in user and redirect
    res.send('<meta http-equiv="Refresh" content="0; url=http://localhost:8080" />'); // Send auto-redirecting page
});

// This route will de-authenticate the client with the Express server and then redirect the client to the CAS logout page.
app.get('/auth/logout', cas.logout, (req, res) => {
    res.send('<meta http-equiv="Refresh" content="0; url=http://localhost:8080" />'); // Send auto-redirecting page
});

// default index route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the DPlanner API!' });
});

// configure all our sub-routers
app.use('/auth', authRouter);
app.use('/plans', requireAuth, plansRouter);
app.use('/courses', requireAuth, coursesRouter);
app.use('/terms', requireAuth, termsRouter);
app.use('/majors', requireAuth, majorsRouter);
app.use('/professors', professorsRouter);
app.use('/globals', requireAuth, globalRouter);


// These cannot be used in production, or will need our own special Authorization
app.get('/reset', (req, res) => {
    resetDB();
    res.send('database reset');
});

// custom middleware for 404 errors
app.use((req, res, next) => {
    res.status(404).send('The route you\'ve requested does not exist');
});

// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

export default app;
