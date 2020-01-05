import mongoose, { Schema } from 'mongoose';

const GlobalSchema = new Schema({
    name: String,
    currTerm: {
        year: Number,
        term: String,
        start: Date,
        end: Date,
    },
    nextTerm: {
        year: Number,
        term: String,
    },
});

// create model class
const CourseModel = mongoose.model('Globals', GlobalSchema);

export default CourseModel;
