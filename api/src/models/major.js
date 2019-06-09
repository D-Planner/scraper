import mongoose, { Schema } from 'mongoose';
import Course from './course';

const RangeSchema = new Schema({
    department: String,
    less_than: Number,
    greater_than: Number,
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
});

const SetSchema = new Schema({
    group: String,
    options: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    ranges: [RangeSchema],
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


RangeSchema.pre('save', function (next) {
    const range = this;
    Course.find({
        $and: [{ department: this.department },
            { number: { $lt: this.less_than, $gt: this.greater_than } }],
    }).select('_id').exec((err, doc) => {
        if (err) { next(err); }
        range.courses = doc;
        range.courses.forEach((course) => { range.parent().options.push(course); });
        next();
    });
});

const MajorModel = mongoose.model('Major', MajorSchema);

export default MajorModel;
