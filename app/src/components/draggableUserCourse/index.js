import React, { Component } from 'react';
import '../draggableCourse/draggableCourse.scss';
import { DragSource as DraggableUserCourse } from 'react-dnd';
import { connect } from 'react-redux';
import { ItemTypes, DialogTypes } from '../../constants';
import { showDialog, setDraggingState } from '../../actions';
import CourseElement from '../staticCourseElement';

const source = {
  beginDrag(props) {
    props.setDraggingState(true, props.catalogCourse);
    return {
      userCourse: props.course,
      catalogCourse: props.catalogCourse,
      sourceTerm: props.sourceTerm,
    };
  },
  endDrag(props, monitor) {
    props.setDraggingState(false, null);
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
/**
 * Sends off information for [dialogOrchestrator].
 * THIS FEATURE IS NOT COMPLETE, NEED TO BUILD SPECIAL RENDERING DEPENDING ON USER CHOICES OF [hour] AND [distribs].
 * @param {*} props
 */
const showCourseInfoDialog = (props) => {
  const dialogOptions = {
    title: `${props.catalogCourse.department} ${props.catalogCourse.number}: ${props.catalogCourse.name}`,
    size: 'lg',
    data: props.catalogCourse,
    previousCourses: props.course.previousCourses,
    showOk: false,
  };
  props.showDialog(DialogTypes.COURSE_INFO, dialogOptions);
};

/** a drag-n-drop capable component containing information on a UserCourse object */
class UserCourse extends Component {
  constructor(props) {
    super(props);
    this.catalogCourse = props.catalogCourse;
  }


  render() {
    return this.props.connectDragSource(
      <div className="popover" onClick={() => showCourseInfoDialog(this.props)} role="button" tabIndex="0">
        <CourseElement
          size={this.props.size}
          error={this.props.course.fulfilled}
          course={this.catalogCourse}
        />
      </div>,
    );
  }
}
// eslint-disable-next-line new-cap
export default connect(null, { showDialog, setDraggingState })(DraggableUserCourse(ItemTypes.COURSE, source, collect)(UserCourse));
