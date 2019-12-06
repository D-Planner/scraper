export const PopulateCourse = [{
    path: 'xlist',
}, {
    path: 'professors',
    select: 'name',
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
    populate: PopulateCourse,
}, {
    path: 'placement_courses',
    populate: PopulateCourse,
}];
