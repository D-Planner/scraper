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
      sourceTerm: props.sourceTerm || null,
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

const collect = (connectDrag, monitor) => {
  return {
    connectDragSource: connectDrag.dragSource(),
    isDragging: monitor.isDragging(),
  };
};

const showCourseInfoDialog = (props) => {
  const dialogOptions = {
    title: `${props.course.name}`,
    size: 'lg',
    data: props.course,
  };
  props.showDialog(DialogTypes.COURSE_INFO, dialogOptions);
};

const Course = (props) => {
  return props.connectDragSource(
    <div onClick={() => showCourseInfoDialog(props)} role="button" tabIndex="0">
      <div className="course">
        <div>
          {`${props.course.department} ${props.course.number}`}
        </div>
        <div>
          {props.course.timeslot}
        </div>
      </div>
    </div>,
  );
};

export default connect(null, { showDialog })(DraggableCourse(ItemTypes.COURSE, source, collect)(Course));
