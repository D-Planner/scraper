import mongoose, { Schema } from 'mongoose';

const TermSchema = new Schema({
    plan_id: { type: Schema.Types.ObjectId, ref: 'Plan' },
    year: { // e.g. 2018, 2019. Represents the beginning of the academic year, i.e. the year of the fall term
        type: Number,
        min: 2000,
        max: 2100,
    },
    quarter: {
        type: String,
        enum: ['F', 'W', 'S', 'X'],
    },
    off_term: Boolean,
    courses: [{ type: Schema.Types.ObjectId, ref: 'UserCourse' }],
}, {
    toJSON: {
        virtuals: true,
    },
});

// define a virtual to extract the abbreviated term name
TermSchema.virtual('name')
    .get(function () { // eslint-disable-line prefer-arrow-callback
        const year = this.quarter === 'F' ? (this.year % 1000).toString() : ((this.year + 1) % 1000).toString();
        return year + this.quarter;
    })
    .set((abbreviated) => {
        const [yr, quarter] = [abbreviated.slice(0, 2), abbreviated.slice(2)];
        this.year = 2000 + yr;
        this.quarter = quarter;
    });

// create model class
const TermModel = mongoose.model('Term', TermSchema);

export default TermModel;
