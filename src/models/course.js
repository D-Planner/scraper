import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema({
    name: String,
    departments: { type: [Schema.Types.ObjectId], ref: 'Department' },
    professor: String,
    enroll_limit: Number,
    median: String,
    timeslot: String,
    description: String,
    prereqs: { type: [Schema.Types.ObjectId], ref: 'Course' },
    terms_offered: [String],
    layuplist_score: Number,
    xlist: { type: [Schema.Types.ObjectId], ref: 'Course' },
}, {
    toJSON: {
        virtuals: true,
    },
});

// create model class
const CourseModel = mongoose.model('Course', CourseSchema);

export default CourseModel;
