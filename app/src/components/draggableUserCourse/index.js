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
    props.setDraggingFulfilledStatus(props.catalogCourse.id);
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

/** a drag-n-drop capable component containing information on a UserCourse object */
class UserCourse extends Component {
  constructor(props) {
    super(props);
    this.catalogCourse = props.catalogCourse;
    this.state = {
      beingHovered: false,
    };
  }

  /**
   * Sends off information for [dialogOrchestrator].
   * THIS FEATURE IS NOT COMPLETE, NEED TO BUILD SPECIAL RENDERING DEPENDING ON USER CHOICES OF [hour] AND [distribs].
   * @param {*} props
   */
  showCourseInfoDialog = () => {
    const dialogOptions = {
      title: `${this.props.catalogCourse.department} ${this.props.catalogCourse.number}: ${this.props.catalogCourse.name}`,
      size: 'lg',
      data: this.props.catalogCourse,
      previousCourses: this.props.previousCourses,
      showOk: false,
    };
    this.props.showDialog(DialogTypes.COURSE_INFO, dialogOptions);
  }


  render() {
    return this.props.connectDragSource(
      <div
        className="popover"
        onMouseEnter={() => this.setState({ beingHovered: true })}
        onMouseLeave={() => this.setState({ beingHovered: false })}
        onClick={() => this.showCourseInfoDialog(this.props)}
        role="button"
        tabIndex="-1" // 0
      >
        <CourseElement
          size={this.props.size}
          error={this.props.course.fulfilledStatus}
          course={this.catalogCourse}
          beingHovered={this.state.beingHovered}
        />
      </div>,
    );
  }
}
// eslint-disable-next-line new-cap
export default connect(null, { showDialog, setDraggingState })(DraggableUserCourse(ItemTypes.COURSE, source, collect)(UserCourse));
