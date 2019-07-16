import mongoose, { Schema } from 'mongoose';

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

UserCourseSchema.virtual('fulfilled')
    .get(function () {
        const prevCourses = (this.user.placement_courses) ? this.user.placement_courses.concat(this.previousCourses.map((c) => {
            return c._id;
        })) : this.previousCourses;
        const prereqs = (this.course.prerequisites) ? this.course.prerequisites.toObject() : [];
        if (!prereqs || prereqs.length === 0) {
            return true;
        }
        return prereqs.every((o) => {
            const dependencyType = Object.keys(o).find((key) => {
                return (o[key].length > 0 && key !== '_id');
            });
            switch (dependencyType) {
            case 'req':
                return (o[dependencyType].some((c) => {
                    return (prevCourses) ? prevCourses.map((prev) => {
                        return prev.toString();
                    }).includes(c.id.toString()) : false;
                }));
            case 'range':
                return (prevCourses.some((c) => {
                    return (o[dependencyType][0] <= c.number && c.number <= o[dependencyType][1] && c.department === this.course.department);
                }));
            default:
                return true;
            }
        });
    });

// create model class
const UserCourseModel = mongoose.model('UserCourse', UserCourseSchema);

export default UserCourseModel;
