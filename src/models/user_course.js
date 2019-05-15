import mongoose, { Schema } from 'mongoose';

const UserCourseSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    term: { type: Schema.Types.ObjectId, ref: 'Term' },
    distrib: String,
    wc: String,
    timeslot: String,
}, {
    toJSON: {
        virtuals: true,
    },
});

// create model class
const UserCourseModel = mongoose.model('UserCourse', UserCourseSchema);

export default UserCourseModel;
