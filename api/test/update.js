import mongoose from 'mongoose';
import User from '../src/models/user';

const differences = [
    { $rename: { first_name: 'firstName' } },
    { $rename: { last_name: 'lastName' } },
];


// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/dplanner';
const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    loggerLevel: 'error',
};
mongoose.connect(mongoURI, mongooseOptions).then(() => {
    console.log('Connected to Database');
    updateUserDocuments();
}).catch((err) => {
    console.log('Not Connected to Database ERROR! ', err);
});

function updateUserDocuments() {
    User.updateMany({}, differences);
}


// set mongoose promises to es6 default
mongoose.Promise = global.Promise;
