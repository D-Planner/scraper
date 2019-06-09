import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema({
    layup_url: String,
    layup_id: Number,
    title: String,
    department: String,
    offered: Boolean,
    distribs: [String],
    total_reviews: Number,
    quality_score: Number,
    layup_score: Number,
    xlist: [String],
    name: String,
    number: Number,
    periods: [String],
    description: String,
    reviews: [String],
    similar_courses: [Number],
    orc_url: String,
    medians: { type: ['Mixed'] },
    terms_offered: [String],
    professors: [String],
    // section: Number,
    // crn: Number,
    // enroll_limit: Number,
    // current_enrollment: Number,
    // room: String,
    // building: String,
    // links: { type: ['Mixed'] },
}, {
    toJSON: {
        virtuals: true,
    },
});

// create model class
const CourseModel = mongoose.model('Course', CourseSchema);

export default CourseModel;
