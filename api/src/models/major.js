import mongoose, { Schema } from 'mongoose';

const MajorSchema = new Schema({
    name: String,
    department: String,
    link: String,
    requirements: {},
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const MajorModel = mongoose.model('Major', MajorSchema);

export default MajorModel;
