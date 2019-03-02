import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema({
    name: { type: String, text: true },
    department: String,
    number: Number,
    section: Number,
    crn: Number,
    professors: [String],
    enroll_limit: Number,
    current_enrollment: Number,
    timeslot: String,
    room: String,
    building: String,
    description: String,
    term: String,
    wc: String,
    distrib: String,
    links: { type: ['Mixed'] },
    related_courses: [Number],
    terms_offered: [String],
    layuplist_score: Number,
    layuplist_id: Number,
    xlist: [Number],
    medians: { type: ['Mixed'] },
}, {
    toJSON: {
        virtuals: true,
    },
});

// create model class
const CourseModel = mongoose.model('Course', CourseSchema);

export default CourseModel;
