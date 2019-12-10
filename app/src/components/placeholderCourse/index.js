import React, { Component } from 'react';
import '../draggableCourse/draggableCourse.scss';
import { DragSource as DraggableUserCourse } from 'react-dnd';
import { ItemTypes } from '../../constants';
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
  constructor(props) {
    super(props);

    this.state = {
      beingHovered: false,
    };
  }


  render() {
    return this.props.connectDragSource(
      <div
        className="popover"
        onMouseEnter={() => this.setState({ beingHovered: true })}
        onMouseLeave={() => this.setState({ beingHovered: false })}
        role="button"
        tabIndex="-1" // 0
      >
        <CourseElement
          placeholder
          showIcon={this.props.showIcon}
          icon={this.props.icon}
          onIconClick={() => this.props.removePlaceholderCourse(this.props.department, this.props.sourceTerm)}
          department={this.props.department}
          size={this.props.size}
          beingHovered={this.state.beingHovered}
        />
      </div>,
    );
  }
}
// eslint-disable-next-line new-cap
export default (DraggableUserCourse(ItemTypes.COURSE, source, collect)(PlaceholderCourse));
