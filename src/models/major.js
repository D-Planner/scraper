import mongoose, { Schema } from 'mongoose';

const RangeSchema = new Schema({
    department: String,
    less_than: Number,
    greater_than: Number,
});

const SetSchema = new Schema({
    type: String,
    courses: [RangeSchema],
});

const MajorSchema = new Schema({
    name: String,
    department: String,
    link: String,
    requirements: [SetSchema],
}, {
    toJSON: {
        virtuals: true,
    },
});

const MajorModel = mongoose.model('Major', MajorSchema);

export default MajorModel;
