const CourseReferenceSelect = ['department', 'number', 'name', 'id'];

export const PopulateCourse = [{
    path: 'professors',
}, {
    path: 'xlist',
    select: CourseReferenceSelect,
}, {
    path: 'prerequisites.req',
    select: CourseReferenceSelect,
}, {
    path: 'prerequisites.grade',
    select: CourseReferenceSelect,
}, {
    path: 'prerequisites.rec',
    select: CourseReferenceSelect,
}];

export const PopulateTerm = [{
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
}];

export const PopulateUser = [{
    path: 'favorite_courses',
    populate: CourseReferenceSelect,
}, {
    path: 'placement_courses',
    select: CourseReferenceSelect,
}];
