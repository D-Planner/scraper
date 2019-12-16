import mongoose, { Schema } from 'mongoose';
// import UserCourse from './user_course';

const PlanSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    major1: String,
    major2: String,
    minor1: String,
    minor2: String,
    modified_main: String,
    modified_sub: String,
    specialization: String,
    terms: [{ type: Schema.Types.ObjectId, ref: 'Term' }],
    relevant_interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    description: String,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, {
    toJSON: {
        virtuals: true,
    },
});

// PlanSchema.index({ user_id: 1, name: -1 }, { unique: true });

PlanSchema.virtual('normalizedName')
    .get(function () { // eslint-disable-line prefer-arrow-callback
        return this.name.toLowerCase().replace(/ /g, '-');
    });

// Make this run on every findbyID(), I know it's possible
// PlanSchema.pre('setPrevCourses', function (next) {
//     this.terms.slice(0).reduce((acc, curr, i, array) => {
//         curr.courses.forEach(async (course) => {
//             await UserCourse.findByIdAndUpdate(course._id, {
//                 previousCourses: acc,
//             });
//             acc.push(course);
//             course.course.xlist.forEach((xlisted) => {
//                 acc.push(xlisted);
//             });
//         });
//         return acc;
//     }, []);
//     next();
// });

// create model class
const PlanModel = mongoose.model('Plan', PlanSchema);

export default PlanModel;
