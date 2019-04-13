import React from 'react';
import { Icon } from 'evergreen-ui';
import './draggableCourse.scss';
import { DragSource as DraggableCourse } from 'react-dnd';
import { ItemTypes } from '../../constants';

const source = {
  beginDrag(props) {
    console.log('Dragging... ');
    return { course: props.course, fromBucket: props.inBucket };
  },
};

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
};

const Course = (props) => {
  const onOffTermClassName = props.offTerm ? 'button on-term' : 'button off-term';

  return props.connectDragSource(
    <div>
      <div className="popover"
        content={({ close }) => (
          courseInfo(props.course)
        )}
      >
        <div className={onOffTermClassName}>
          <div className="button">
            <div id="bucketCourseTitle"
              className="pane"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {props.course.department}
                {props.course.number}
              </div>
              <div>
                {props.course.timeslot}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
  );
};

const courseInfo = (course) => {
  return (
    <div className="list-group-item">
      <div className="list-group-item-heading"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {course.title}
        {' '}
        <div className="badge"
          color="secondary"
        >
          {course.subject}
          {course.number}
        </div>
        <Icon id="minus_icon" icon="small-minus" />
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
            <div className="badge" color="primary" href={course.description}>Description</div>
            {' '}
            <div className="badge" color="primary" href={course.text}>Textbook information</div>
            {' '}
            {course.learning_objective.length > 0 && <div className="badge" color="primary" href={course.learning_objective}>Learning objective</div>}
          </li>
        </ul>
      </div>
    </div>
  );
};

// eslint-disable-next-line new-cap
export default DraggableCourse(ItemTypes.COURSE, source, collect)(Course);
