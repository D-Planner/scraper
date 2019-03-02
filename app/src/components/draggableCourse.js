import React from 'react';
import { Icon, Popover, Pane } from 'evergreen-ui';
import '../style/bucket.css';
import {
  Button,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Badge,
} from 'reactstrap';
import { DragSource as DraggableCourse } from 'react-dnd';
import { ItemTypes } from '../constants';

const source = {
  beginDrag(props) {
    return {};
  },
};

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
};

const Course = (props) => {
  return props.connectDragSource(
    <div>
      <Popover
        content={({ close }) => (
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            {courseInfo(props.course)}
          </Pane>
        )}
      >
        <Button className="bucketCourse"
          style={props.offTerm ? {
            background: '#FFFFFF',
            width: '80%',
            marginTop: '5px',
            borderColor: '#FFFFFF',
            boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.08)',
          } : {
            background: '#FFFFFF',
            width: '80%',
            marginTop: '5px',
            borderColor: '#FFFFFF',
            boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.25)',
          }
          }
        >
          <Pane id="bucketCourseTitle"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {props.course.subject}
              {props.course.number}
            </div>
            <div>
              {props.course.period}
            </div>
          </Pane>
        </Button>
      </Popover>
    </div>,
  );
};

const courseInfo = (course) => {
  return (
    <ListGroupItem>
      <ListGroupItemHeading
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {course.title}
        {' '}
        <Badge color="secondary">
          {course.subject}
          {course.number}
        </Badge>
        <Icon id="minus_icon" icon="small-minus" />
      </ListGroupItemHeading>
      <ListGroupItemText>
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
            <Badge color="primary" href={course.description}>Description</Badge>
            {' '}
            <Badge color="primary" href={course.text}>Textbook information</Badge>
            {' '}
            {course.learning_objective.length > 0 && <Badge color="primary" href={course.learning_objective}>Learning objective</Badge>}
          </li>
        </ul>
      </ListGroupItemText>
    </ListGroupItem>
  );
};

// eslint-disable-next-line new-cap
export default DraggableCourse(ItemTypes.COURSE, source, collect)(Course);

//   shouldComponentUpdate(nextProps) {
//     const differentTitle = this.props.displayText
//         !== nextProps.displayText;
//     const differentDone = this.props.dragging
//         !== nextProps.dragging;
//     return differentTitle || differentDone;
//   }
