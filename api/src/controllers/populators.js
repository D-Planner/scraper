const CourseReferenceSelect = ['department', 'number', 'name'];

const PopulateCourseRef = [{
    path: 'prerequisites.req',
    select: CourseReferenceSelect,
}, {
    path: 'prerequisites.range',
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

export default PopulateCourseRef;
