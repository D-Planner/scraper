import React from 'react';
import '../draggableCourse/draggableCourse.scss';
import { DragSource as DraggableUserCourse } from 'react-dnd';
import { ItemTypes } from '../../constants';

const source = {
  beginDrag(props) {
    console.log('Dragging... ');
    return {
      userCourse: props.course,
      catalogCourse: props.catalogCourse,
      sourceTerm: props.sourceTerm,
    };
  },
  endDrag(props, monitor) {
    console.log('Dropped!');

    // if we did not detect a valid drop target, delete the course from the sourceTerm
    if (!monitor.didDrop()) {
      props.removeCourseFromTerm();
    }
  },
};

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
};

const UserCourse = (props) => {
  const { catalogCourse } = props;

  return props.connectDragSource(
    <div>
      <div className="popover"
        content={({ close }) => ( // TODO this doesn't do anything
          courseInfo(catalogCourse)
        )}
      >
        <div className="course">
          <div>
            {catalogCourse.department}
            {catalogCourse.number}
          </div>
          <div>
            {catalogCourse.timeslot}
          </div>
        </div>
      </div>
    </div>,
  );
};

const courseInfo = (course) => {
  return (
    <div className="list-group-item">
      <div className="list-group-item-heading">
        {course.title}
        {' '}
        <div className="badge">
          {course.subject}
          {course.number}
        </div>
      </div>
      <div className="list-group-item-text">
        <ul>
          <li>
            <small>Term code: </small>
            <small>{course.term}</small>
          </li>
          <li>
            <small>CRN: </small>
            <small>{course.crn}</small>
          </li>
          <li>
            <small>Section: </small>
            <small>{course.section}</small>
          </li>
          <li>
            <small>Xlist: </small>
            {course.xlist.length > 0 ? <small>{course.xlist}</small> : <small>N/A</small>}
          </li>
          <li>
            <small>WC: </small>
            <small>{course.wc}</small>
          </li>
          <li>
            <small>Distrib: </small>
            <small>{course.distrib}</small>
          </li>
          <li>
            <small>Building: </small>
            <small>{course.building}</small>
          </li>
          <li>
            <small>Room: </small>
            <small>{course.room}</small>
          </li>
          <li>
            <small>Period: </small>
            <small>{course.period}</small>
          </li>
          <li>
            <small>Instructor: </small>
            <small>{course.instructor}</small>
          </li>
          <li>
            <small>Enrollment limit: </small>
            <small>{course.enrollment_limit}</small>
          </li>
          <li>
            <small>Current enrollment: </small>
            <small>{course.current_enrollment}</small>
          </li>
          <li>
            <small>Status: </small>
            <small>{course.status}</small>
          </li>
          <li>
            <small>Links: </small>
            <div className="badge" href={course.description}>Description</div>
            {' '}
            <div className="badge" href={course.text}>Textbook information</div>
            {' '}
            {course.learning_objective.length > 0 && <div className="badge" href={course.learning_objective}>Learning objective</div>}
          </li>
        </ul>
      </div>
    </div>
  );
};

// eslint-disable-next-line new-cap
export default DraggableUserCourse(ItemTypes.COURSE, source, collect)(UserCourse);
