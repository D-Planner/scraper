import mongoose, { Schema } from 'mongoose';

const ViewSchema = new Schema({
    type: String, // 'course', 'plan', 'user', 'professor'
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    data: {},
    time_stamp: Date,
});

const ViewModel = mongoose.model('View', ViewSchema);

export default ViewModel;
