import mongoose from 'mongoose';
import Course from '../src/models/course';
import Professor from '../src/models/professor';
import prerequisitesJSON from '../static/data/prerequisites.json';
import courses from '../static/data/courses.json';

const differences = {

};


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


// set mongoose promises to es6 default
mongoose.Promise = global.Promise;
