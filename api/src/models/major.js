import mongoose, { Schema } from 'mongoose';

const MajorSchema = new Schema({
    name: String,
    department: String,
    link: String,
    requirements: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
}, {
    toJSON: {
        virtuals: true,
    },
});

const MajorModel = mongoose.model('Major', MajorSchema);

export default MajorModel;
