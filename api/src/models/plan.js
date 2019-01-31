import mongoose, { Schema } from 'mongoose';

const PlanSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    major1: String,
    major2: String,
    minor1: String,
    minor2: String,
    modified_main: String,
    modified_sub: String,
    specialization: String,
}, {
    toJSON: {
        virtuals: true,
    },
});

// create model class
const PlanModel = mongoose.model('Plan', PlanSchema);

export default PlanModel;
