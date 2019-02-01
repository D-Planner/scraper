import mongoose, { Schema } from 'mongoose';

const TermSchema = new Schema({
    plan_id: { type: Schema.Types.ObjectId, ref: 'Plan' },
    name: String,
    off_term: Boolean,
    courses: [String],
    // courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    // N.B. implement above once courses are stored in the db
    // for now the ids are just arbitrary strings
}, {
    toJSON: {
        virtuals: true,
    },
});

// create model class
const TermModel = mongoose.model('Term', TermSchema);

export default TermModel;
