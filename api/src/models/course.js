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

const CourseSchema = new Schema({
    layup_url: String,
    layup_id: Number,
    title: { type: String, index: 'text' },
    department: String,
    offered: Boolean,
    distribs: [String],
    wcs: [String],
    total_reviews: Number,
    quality_score: Number,
    layup_score: Number,
    xlist: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
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
    prerequisites: [{
        req: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        range: [{ type: Number }],
        grade: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        rec: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        abroad: { type: Boolean },
    }],
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

CourseSchema.virtual('yearlyOccurences')
    .get(function () {
        return (this.terms_offered) ? this.terms_offered
            .reduce((acc, cur, i) => {
                const [year, term] = cur.split(/(?!\d)/g);
                if (acc[year]) acc[year].push(term);
                else acc[year] = [term];
                return acc;
            }, {}) : {};
    });

// Format ["F", "W", "S", "X"]
CourseSchema.virtual('likely_terms').get(function () {
    try {
        const indexFromEndYearlyOccurences = (i) => {
            const values = Object.values(this.yearlyOccurences);
            return values[values.length - i];
        };
        const patternSeach = (yOccurences) => {
            // This is a dictionary of pattern types as keys and functions as values that test the key pattern type.
            // Each function returns
            const patternTypes = {
                consistency: (occ) => {
                    const annualRepititions = Object.entries(occ)
                        .reduce((acc, [k, v]) => {
                            if (acc.some((e) => {
                                return e.every((i, j) => {
                                    return i === v[j];
                                });
                            })) return acc;
                            if (Object.values(occ)
                                .reduce((n, x) => {
                                    return (n + (x.every((e, i) => {
                                        return e === v[i];
                                    })));
                                }, 0) > Object.values(occ).length - 3) acc.push(v);
                            return acc;
                        }, []);
                    if (annualRepititions.length === 1) return Object.values(occ)[Object.values(occ).length - 2];
                    return null;
                },
                // biennial: (occ) => {
                //     const evenYears = Object.entries(occ)
                //         .filter(([k, v]) => {
                //             return (parseInt(k) % 2 === 0);
                //         });
                //     const oddYears = Object.entries(occ)
                //         .filter(([k, v]) => {
                //             return (parseInt(k) % 2 !== 0);
                //         });
                //     console.log('Even Years,', evenYears);
                //     console.log('Odd Years,', oddYears);
                // },
            };
            return Object.entries(patternTypes)
                .map(([k, fn]) => { return fn(yOccurences); })
                .filter((e) => { return e !== null; });
        };

        const foundPatterns = patternSeach(this.yearlyOccurences);
        if (foundPatterns.length === 1) return foundPatterns[0];
        // If we didn't find a single patter (If we have multiple, or none), just return what happened last year
        return indexFromEndYearlyOccurences(2);
    } catch (e) {
        console.log(e);
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
