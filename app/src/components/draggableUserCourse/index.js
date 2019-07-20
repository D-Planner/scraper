import React, { Component } from 'react';
import '../draggableCourse/draggableCourse.scss';
import { DragSource as DraggableUserCourse } from 'react-dnd';
import { connect } from 'react-redux';
import { ItemTypes, DialogTypes } from '../../constants';
import { showDialog } from '../../actions';

const source = {
  beginDrag(props) {
    return {
      userCourse: props.course,
      catalogCourse: props.catalogCourse,
      sourceTerm: props.sourceTerm,
    };
  },
  endDrag(props, monitor) {
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
    console.log(this.props.course.fulfilled);
    return this.props.connectDragSource(
      <div className="popover" onClick={() => showCourseInfoDialog(this.props)} role="button" tabIndex="0">
        <div className={`course sm${(!this.props.course.fulfilled) ? ' error' : ''}`}>
          <div className="title-box">
            <div className="course-left">
              {`${this.catalogCourse.department} ${this.catalogCourse.number}`}
            </div>
            <div className="spacer" />
            <div className="course-right">
              {this.catalogCourse.name}
            </div>
          </div>
        </div>
      </div>,
    );
  }
}
// eslint-disable-next-line new-cap
export default connect(null, { showDialog })(DraggableUserCourse(ItemTypes.COURSE, source, collect)(UserCourse));
