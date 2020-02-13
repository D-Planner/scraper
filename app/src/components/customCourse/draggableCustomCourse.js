import React, { Component } from 'react';
import { DragSource as DraggableUserCourse } from 'react-dnd';
import CourseElement from '../staticCourseElement';
import { ItemTypes } from '../../constants';
import '../draggableCourse/draggableCourse.scss';

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
        props.removeCustomCourse(props.custom, props.sourceTerm).then((next) => { // This needs to become something with the ID?
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

class CustomCourseElement extends Component {
  render() {
    return this.props.connectDragSource(
      <div>
        <CourseElement
          custom={this.props.custom}
          showIcon={this.props.showIcon}
          icon={this.props.icon}
          onIconClick={() => this.props.removeCustomCourse()} // This also needs to use the ID?
          size={this.props.size}
          beingHovered={this.props.beingHovered}
          static={this.props.inTerm}
          updateCustomCourse={this.props.updateCustomCourse}
        />
      </div>,
    );
  }
}

// eslint-disable-next-line new-cap
export default (DraggableUserCourse(ItemTypes.COURSE, source, collect)(CustomCourseElement));
