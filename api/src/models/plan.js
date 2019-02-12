import mongoose, { Schema } from 'mongoose';

const PlanSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    major1: String,
    major2: String,
    minor1: String,
    minor2: String,
    modified_main: String,
    modified_sub: String,
    specialization: String,
    terms: [{ type: Schema.Types.ObjectId, ref: 'Term' }],
}, {
    toJSON: {
        virtuals: true,
    },
});

PlanSchema.index({ user_id: 1, name: -1 }, { unique: true });

PlanSchema.virtual('normalizedName')
    .get(function () { // eslint-disable-line prefer-arrow-callback
        return this.name.toLowerCase().replace(/ /g, '-');
    });

// create model class
const PlanModel = mongoose.model('Plan', PlanSchema);

export default PlanModel;
