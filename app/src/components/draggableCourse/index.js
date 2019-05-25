import React from 'react';
import './draggableCourse.scss';
import { DragSource as DraggableCourse } from 'react-dnd';
import { connect } from 'react-redux';
import { ItemTypes, DialogTypes } from '../../constants';
import { showDialog } from '../../actions';


const source = {
  beginDrag(props) {
    console.log('Dragging... ');
    return {
      course: props.course,
    };
  },
  endDrag(props, monitor) {
    console.log('Dropped!');

    // if we did not detect a valid drop target, delete the course from the sourceTerm
    if (!monitor.didDrop() && props.removeCourseFromTerm) {
      props.removeCourseFromTerm();
    }
  },
};

const collect = (connectDrag, monitor) => {
  return {
    connectDragSource: connectDrag.dragSource(),
    isDragging: monitor.isDragging(),
  };
};

const showCourseInfoDialog = (props) => {
  const dialogOptions = {
    title: `${props.course.department} ${props.course.number}: ${props.course.name}`,
    size: 'lg',
    data: props.course,
    showOk: false,
  };
  props.showDialog(DialogTypes.COURSE_INFO, dialogOptions);
};

const Course = (props) => {
  const { course } = props;

  return props.connectDragSource(
    <div className="popover" onClick={() => showCourseInfoDialog(props)} role="button" tabIndex="0">
      <div className="course">
        <div>
          {`${course.department} ${course.number}`}
        </div>
        <div>
          {course.timeslot}
        </div>
      </div>
    </div>,
  );
};

export default connect(null, { showDialog })(DraggableCourse(ItemTypes.COURSE, source, collect)(Course));
