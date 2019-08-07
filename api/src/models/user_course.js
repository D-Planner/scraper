import mongoose, { Schema } from 'mongoose';
import Course from './course';

const UserCourseSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    term: { type: Schema.Types.ObjectId, ref: 'Term' },
    major: { type: Schema.Types.ObjectId, ref: 'Major' },
    distrib: String,
    wc: String,
    timeslot: String,
    previousCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
}, {
    toJSON: {
        virtuals: true,
    },
});

UserCourseSchema.pre('find', function (next) {
    this.populate('user');
    next();
});

// -1: Unfulfilled
// 0: warning
// 1: fulfilled

const [ERROR, WARNING, CLEAR] = ['error', 'warning', ''];

UserCourseSchema.virtual('fulfilled')
    .get(function () {
        const prevCourses = ((this.user.placement_courses) ? this.user.placement_courses.concat(this.previousCourses.map((c) => {
            return c._id;
        })) : this.previousCourses).map((p) => { return p.toString(); });
        let prereqs = (this.course.prerequisites) ? this.course.prerequisites.toObject() : [];
        if (!prereqs || prereqs.length === 0) {
            return CLEAR;
        }
        prereqs = prereqs.map((o) => {
            let dependencyType = Object.keys(o).find((key) => {
                return (o[key].length > 0 && key !== '_id');
            });
            if (!dependencyType && Object.keys(o).includes('abroad')) dependencyType = 'abroad';

            const prevCoursesIncludes = () => {
                return o[dependencyType].map((c) => { return c.id; })
                    .some((id) => {
                        return (prevCourses) ? prevCourses.includes(id.toString()) : false;
                    });
            };
            switch (dependencyType) {
            case 'abroad':
                return WARNING;
            case 'req':
                return prevCoursesIncludes() ? CLEAR : ERROR;
            case 'range':
                return (prevCourses.some((c) => {
                    return (o[dependencyType][0] <= c.number && c.number <= o[dependencyType][1] && c.department === this.course.department);
                })) ? CLEAR : ERROR;
            case 'grade':
                return prevCoursesIncludes() ? WARNING : ERROR;
            case 'rec':
                return prevCoursesIncludes() ? WARNING : ERROR;
            default:
                return CLEAR;
            }
        });
        if (prereqs.includes(ERROR)) return ERROR;
        if (prereqs.includes(WARNING)) return WARNING;
        return CLEAR;
    });

// create model class
const UserCourseModel = mongoose.model('UserCourse', UserCourseSchema);

export default UserCourseModel;
