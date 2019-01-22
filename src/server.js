import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import apiRouter from './router';

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

app.get('/', (req, res) => {
    res.send('Hello world!');
});

// default index route
app.use('/api', apiRouter);

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/dplanner';
const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
};
mongoose.connect(mongoURI, mongooseOptions);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;
