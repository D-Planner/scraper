import mongoose, { Schema } from 'mongoose';

const UserCourseSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    term: { type: Schema.Types.ObjectId, ref: 'Term' },
    major: { type: Schema.Types.ObjectId, ref: 'Major' },
    distrib: String,
    wc: String,
    timeslot: String,
    fulfilledStatus: String, // This is for keeping track of in place fulfillment, not dragging
    placeholder: String,
}, {
    toJSON: {
        virtuals: true,
    },
});

// -1: Unfulfilled
// 0: warning
// 1: fulfilled

// const [ERROR, WARNING, CLEAR] = ['error', 'warning', ''];

// UserCourseSchema.virtual('fulfilled')
//     .get(function () {
//         if (this.term.plan_id && this.user.placement_courses) {
//             console.log(this.term.plan_id, this.term.id, this.course.id, this.user.placement_courses);
//             return Promise.resolve(CoursesController.getFulfilledStatus(this.term.plan_id, this.term.id, this.course.id, this.user.placement_courses)).then((r) => {
//                 return r;
//             }).catch((e) => {
//                 console.log(e);
//             });
//         }
//         return this.fulfilled;
//         // let prevCourses = [];
//         // if (this.term.previousCourses && this.user.placement_courses) {
//         //     prevCourses = this.term.previousCourses.concat(this.user.placement_courses);
//         // } else if (this.term.prevCourses) {
//         //     prevCourses = this.term.previousCourses;
//         // } else if (this.user.placement_courses) {
//         //     prevCourses = this.user.placement_courses;
//         // }
//         // console.log(prevCourses);
//         // let prereqs = (this.course.prerequisites) ? this.course.prerequisites.toObject() : [];
//         // if (!prereqs || prereqs.length === 0) {
//         //     return CLEAR;
//         // }
//         // prereqs = prereqs.map((o) => {
//         //     let dependencyType = Object.keys(o).find((key) => {
//         //         return (o[key].length > 0 && key !== '_id');
//         //     });
//         //     if (!dependencyType && Object.keys(o).includes('abroad')) dependencyType = 'abroad';

//         //     const prevCoursesIncludes = () => {
//         //         return o[dependencyType].map((c) => { return c.id; })
//         //             .some((id) => {
//         //                 return (prevCourses) ? prevCourses.includes(id.toString()) : false;
//         //             });
//         //     };
//         //     switch (dependencyType) {
//         //     case 'abroad':
//         //         return WARNING;
//         //     case 'req':
//         //         return prevCoursesIncludes() ? CLEAR : ERROR;
//         //     case 'range':
//         //         return (prevCourses.some((c) => {
//         //             return (o[dependencyType][0] <= c.number && c.number <= o[dependencyType][1] && c.department === this.course.department);
//         //         })) ? CLEAR : ERROR;
//         //     case 'grade':
//         //         return prevCoursesIncludes() ? WARNING : ERROR;
//         //     case 'rec':
//         //         return prevCoursesIncludes() ? WARNING : ERROR;
//         //     default:
//         //         return CLEAR;
//         //     }
//         // });
//         // if (prereqs.includes(ERROR)) return ERROR;
//         // if (prereqs.includes(WARNING)) return WARNING;
//         // return CLEAR;
//     });

// create model class
const UserCourseModel = mongoose.model('UserCourse', UserCourseSchema);


export default UserCourseModel;
