import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema({
    layup_url: String,
    layup_id: Number,
    title: { type: String, text: true },
    department: String,
    offered: Boolean,
    distribs: [String],
    total_reviews: Number,
    quality_score: Number,
    layup_score: Number,
    xlist: [Number], // what should this be?
    name: String,
    number: Number,
    periods: [String],
    description: String,
    reviews: [String],
    similar_courses: [{}], // what should this be?
    orc_url: String,
    medians: [{}],
    terms_offered: [String],
    professors: [{ type: Schema.Types.ObjectId, ref: 'Professor' }],
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
