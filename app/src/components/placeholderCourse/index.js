import React, { Component } from 'react';
import '../draggableCourse/draggableCourse.scss';
import { DragSource as DraggableUserCourse } from 'react-dnd';
import { ItemTypes, DialogTypes } from '../../constants';
import CourseElement from '../staticCourseElement';

const source = {
  beginDrag(props) {
    // props.setDraggingState(true, props.catalogCourse);
    // props.setDraggingFulfilledStatus(props.catalogCourse.id);
    return props;
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      console.log(props);
      if (props.sourceTerm) {
        props.removePlaceholderCourse(props.department, props.sourceTerm).then((next) => {
          console.log('removed');
          next();
        });
      }
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
class PlaceholderCourse extends Component {
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
        role="button"
        tabIndex="-1" // 0
      >
        <CourseElement
          placeholder
          department={this.props.department}
          size={this.props.size}
          beingHovered={false}
        />
      </div>,
    );
  }
}
// eslint-disable-next-line new-cap
export default (DraggableUserCourse(ItemTypes.COURSE, source, collect)(PlaceholderCourse));
