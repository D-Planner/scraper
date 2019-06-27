const CourseReferenceSelect = ['department', 'number', 'name', 'id'];

const PopulateCourse = [{
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
    path: 'professors',
}, {
    path: 'xlist',
    select: CourseReferenceSelect,
}];

const PopulateTerm = {
    path: 'courses',
    populate: [{
        path: 'course',
        select: '-reviews',
        populate: PopulateCourse,
    }, {
        path: 'previousCourses',
        select: 'id',
    }],
};

export default [
    PopulateCourse,
    PopulateTerm,
];
