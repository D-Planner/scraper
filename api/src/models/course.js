import mongoose, { Schema } from 'mongoose';

const LetterToScore = { // Need to also consider 'A / A-' ones, how should we manage these?
    A: 4,
    'A-': 3.7,
    'B+': 3.3,
    B: 3,
    'B-': 2.7,
    'C+': 2.3,
    C: 2,
    'C-': 1.7,
    'D+': 1.3,
    D: 1,
};

const TermToString = {
    F: 'Fall',
    W: 'Winter',
    S: 'Spring',
    X: 'Summer',
};

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
    professors: [{ type: Schema.Types.ObjectId, ref: 'Professor' }],
    // section: Number,
    // crn: Number,
    // enroll_limit: Number,
    // current_enrollment: Number,
    // room: String,
    // building: String,
    // links: { type: ['Mixed'] },
}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
});


// This works!
CourseSchema.virtual('avg_median').get(function () {
    try {
        let sum = 0; let count = 0;
        this.medians.forEach((t) => {
            t.courses.forEach((c) => {
                c.median.split('/').forEach((g) => {
                    sum += (LetterToScore[g]) ? LetterToScore[g] : 0;
                    count += 1;
                });
            });
        });
        const avg = sum / count;
        const closest = Object.values(LetterToScore).reduce((prev, curr) => {
            return Math.abs(curr - avg) < Math.abs(prev - avg) ? curr : prev;
        });
        return Object.keys(LetterToScore).find((l) => {
            return LetterToScore[l] === closest;
        });
    } catch (e) {
        return 'N/A';
    }
});

// For terms most likely to be offered, I'm thinking we take the average of times offered in each term (F,W,S,X), \
// and whichever term has recurrence greater than the average, we display those as likely_terms?

// Working!
CourseSchema.virtual('likely_terms').get(function () {
    try {
        const occurrences = this.terms_offered.map((t) => {
            return TermToString[t.replace(/\d/g, '')];
        }).reduce((acc, cur, i) => {
            if (!acc[cur]) acc[cur] = 1;
            else acc[cur] += 1;
            return acc;
        }, {});
        const avg = Object.values(occurrences).reduce((acc, curr) => {
            acc += curr / Object.values(occurrences).length;
            return acc;
        }, 0);
        Object.keys(occurrences).forEach((k) => {
            if (occurrences[k] < avg) delete occurrences[k];
        });
        return Object.keys(occurrences);
    } catch (e) {
        return e;
    }
});
//
// // I'm not sure how we should do this, becuase the spider doesn't provide us with \
// // max-enrollment for courses, just the amount enrolled in each individual course.
// CourseSchema.virtual('enrollment_difficulty').get(() => {});

// create model class
const CourseModel = mongoose.model('Course', CourseSchema);

export default CourseModel;
