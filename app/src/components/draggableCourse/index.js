import React from 'react';
import './draggableCourse.scss';
import { DragSource as DraggableCourse } from 'react-dnd';
import { connect } from 'react-redux';
import CourseElement from '../staticCourseElement';
import { ItemTypes, DialogTypes } from '../../constants';
import { showDialog, setDraggingState } from '../../actions';

const source = {
  beginDrag(props) {
    props.setDraggingState(true, props.course);
    props.setDraggingFulfilledStatus(props.course.id);
    return {
      course: props.course,
    };
  },
  endDrag(props, monitor) {
    props.setDraggingState(false, null);
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

/**
 * Sends off information for [dialogOrchestrator].
 * THIS FEATURE IS NOT COMPLETE, NEED TO BUILD SPECIAL RENDERING DEPENDING ON USER CHOICES OF [hour] AND [distribs].
 * @param {*} props
 */
const showCourseInfoDialog = (props) => {
  const dialogOptions = {
    title: `${props.course.department} ${props.course.number}: ${props.course.name}`,
    size: 'lg',
    data: props.course,
    showOk: false,
  };
  props.showDialog(DialogTypes.COURSE_INFO, dialogOptions);
};

/** a drag-n-drop capable component containing information on a Course object */
const Course = (props) => {
  const { course } = props;
  return props.connectDragSource(
    <div className="popover" onClick={() => showCourseInfoDialog(props)} role="button" tabIndex="0">
      <CourseElement
        size="bg"
        course={course}
      />
    </div>,
  );
};

export default connect(null, { showDialog, setDraggingState })(DraggableCourse(ItemTypes.COURSE, source, collect)(Course));
