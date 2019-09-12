export const PopulateCourse = [{
    path: 'xlist',
}, {
    path: 'professors',
}, {
    path: 'prerequisites.req',
}, {
    path: 'prerequisites.grade',
}, {
    path: 'prerequisites.rec',
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
}, {
    path: 'placement_courses',
}];
