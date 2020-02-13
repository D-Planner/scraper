import mongoose, { Schema } from 'mongoose';

const ErrorSchema = new Schema({
    source: String,
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    data: {},
    time_stamp: Date,
});

const ErrorModel = mongoose.model('Error', ErrorSchema);

export default ErrorModel;
