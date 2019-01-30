import mongoose, { Schema } from 'mongoose';

const TermSchema = new Schema({
    plan_id: { type: Schema.Types.ObjectId, ref: 'Plan' },
    name: String,
    off_term: Boolean,
    courses: { type: [Schema.Types.ObjectId], ref: 'Course' },
}, {
    toJSON: {
        virtuals: true,
    },
});

// create model class
const TermModel = mongoose.model('Term', TermSchema);

export default TermModel;
