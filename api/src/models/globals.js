import mongoose, { Schema } from 'mongoose';

const GlobalSchema = new Schema({
    name: String,
    currentTerm: {
        year: Number,
        term: String,
    },
    nextTerm: {
        year: Number,
        term: String,
    },
});

// create model class
const CourseModel = mongoose.model('Globals', GlobalSchema);

export default CourseModel;
