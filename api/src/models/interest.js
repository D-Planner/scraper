import mongoose, { Schema } from 'mongoose';

const InterestSchema = new Schema({
    name: String,
    departments: [String],
    campus_resources: [String],
    sub_interests: [String],
});

const InterestModel = mongoose.model('Interest', InterestSchema);

export default InterestModel;
