const CourseReferenceSelect = ['department', 'number', 'name', 'id'];

const PopulateCourse = [{
    path: 'professors',
}, {
    path: 'prerequisites.req',
    select: CourseReferenceSelect,
}, {
    path: 'prerequisites.grade',
    select: CourseReferenceSelect,
}, {
    path: 'prerequisites.rec',
    select: CourseReferenceSelect,
}, {
    path: 'prerequisites.abroad',
}, {
    path: 'xlist',
    select: CourseReferenceSelect,
}];

const PopulateTerm = [{
    path: 'courses',
    populate: [{
        path: 'course',
        select: '-reviews',
        populate: PopulateCourse,
    }, {
        path: 'previousCourses',
        select: 'id',
    }],
}, {
    path: 'plan_id.user_id',
},
];

const PopulateUser = [{
    path: 'favorite_courses',
    populate: CourseReferenceSelect,
}, {
    path: 'placement_courses',
    select: CourseReferenceSelect,
}];

export default [
    PopulateCourse,
    PopulateTerm,
    PopulateUser,
];
