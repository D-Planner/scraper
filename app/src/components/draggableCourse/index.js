import React from 'react';
import './draggableCourse.scss';
import { DragSource as DraggableCourse } from 'react-dnd';
import { ItemTypes } from '../../constants';

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

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
};

const Course = (props) => {
  const { course } = props;

  return props.connectDragSource(
    <div>
      <div className="popover">
        <div className="course">
          <div>
            {course.department}
            {course.number}
          </div>
          <div>
            {course.timeslot}
          </div>
        </div>
      </div>
    </div>,
  );
};

// eslint-disable-next-line new-cap
export default DraggableCourse(ItemTypes.COURSE, source, collect)(Course);
