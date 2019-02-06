import Course from '../models/course';
import courses from '../services/courses.json';

export const get = (req, res) => {
    Course.find({})
        .then((result) => {
            res.json(result);
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

export const seed = (req, res) => {
    Promise.resolve(courses.map((course) => {
        return Course.create({
            name: course.title,
            department: course.subject,
            number: course.number,
            section: course.section,
            crn: course.crn,
            professors: course.professors,
            enroll_limit: course.enrollment_limit,
            current_enrollment: course.current_enrollment,
            timeslot: course.period,
            room: course.room,
            building: course.building,
            description: course.description,
            term: course.term,
            wc: course.wc,
            distrib: course.distrib,
            links: course.links,
            related_courses: course.related_courses,
            terms_offered: course.terms_offered,
            layuplist_score: course.layuplist_score,
            layuplist_id: course.layuplist_id,
            medians: course.medians,
        });
    })).then(() => {
        res.json('Courses successfully added to db 🚀');
    }).catch((error) => {
        res.status(500).json({ error });
    });
};
