import mongoose, { Schema } from 'mongoose';

const AdvisorSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    department: String,
    settings: {},
    email: { type: String, required: true, unique: true },
    advisees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    autocreated: Boolean,
    netid: String,
    account_created: Number,
    account_claimed: Number,
});

const AdvisorModel = mongoose.model('Advisor', AdvisorSchema);

export default AdvisorModel;
