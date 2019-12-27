import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
// import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import { requireAuth } from './authentication/init';
import { authRouter, plansRouter, coursesRouter, termsRouter, majorsRouter, professorsRouter, globalRouter, interestsRouter, advisorRouter, dataRouter } from './routes';
import CoursesController, { trim } from './controllers/courses_controller';
import UserModel from './models/user';
import CourseModel from './models/course';
import { PopulateCourse } from './controllers/populators';

require('dotenv').config({ silent: true });

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

// Set up SendGrid email API
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    return new Promise((resolve, reject) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(() => {
                mongoose.connect(mongoURI).then(() => {
                    CoursesController.createCourse().then(() => {
                        const newUser = new UserModel({
                            email: 'a@a.com',
                            password: 'a',
                            firstName: 'D',
                            lastName: 'Planner',
                            university: 'Dartmouth',
                            graduationYear: 2023,
                            emailVerified: true,
                            accessGranted: true,
                        });
                        newUser.save().then(() => {
                            resolve();
                        });
                    });
                }).catch(() => {
                    console.log('error in connecting to new URI');
                });
            });
        });
    });
};

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
app.use('/interests', requireAuth, interestsRouter);
app.use('/advisors', requireAuth, advisorRouter);
app.use('/data', requireAuth, dataRouter);

// Get information for course display without being logged in
app.get('/public/course/:id', (req, res) => {
    CourseModel.findById(req.params.id)
        .populate(PopulateCourse)
        .then((result) => {
            const json = result.toJSON();
            delete json.professors;
            delete json.prerequisites;
            delete json.terms_offered;
            delete json.yearlyOccurences;
            delete json.likely_terms;
            delete json.similar_courses;
            res.json(trim(json));
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
});


// These cannot be used in production, or will need our own special Authorization
app.get('/reset', (req, res) => {
    if (req.headers.key === '7d0cde01-30bb-465a-b614-9a9237a98f20') {
        resetDB().then(() => {
            res.send('database reset');
        }).catch((error) => {
            res.status(500).send({ error });
        });
    } else {
        res.status(403).send('not authorized');
    }
});

// custom middleware for 404 errors
app.use((req, res, next) => {
    res.status(404).send('The route you\'ve requested does not exist');
});

// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

export default app;
