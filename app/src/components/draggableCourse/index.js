import React from 'react';
import { DragSource as DraggableCourse } from 'react-dnd';
import { connect } from 'react-redux';
import CourseElement from '../staticCourseElement';
import { ItemTypes, DialogTypes } from '../../constants';
import { showDialog, setDraggingState } from '../../actions';

import './draggableCourse.scss';

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

/** a drag-n-drop capable component containing information on a Course object */


class Course extends React.Component {
  constructor(props) {
    super(props);
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
      title: `${this.props.course.department} ${this.props.course.number}: ${this.props.course.name}`,
      size: 'lg',
      data: this.props.course,
      showOk: false,
    };
    this.props.showDialog(DialogTypes.COURSE_INFO, dialogOptions);
  }

  render() {
    return this.props.connectDragSource(
      <div className="popover"
        onMouseEnter={() => this.setState({ beingHovered: true })}
        onMouseLeave={() => this.setState({ beingHovered: false })}
        onClick={() => this.showCourseInfoDialog(this.props)}
        role="button"
        tabIndex="0"
      >
        <CourseElement
          size="xl"
          course={this.props.course}
          beingHovered={this.state.beingHovered}
        />
      </div>,
    );
  }
}

export default connect(null, { showDialog, setDraggingState })(DraggableCourse(ItemTypes.COURSE, source, collect)(Course));
