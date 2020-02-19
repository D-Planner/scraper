import React, { Component } from 'react';
import { DragSource as DraggableUserCourse } from 'react-dnd';
import ReactTooltip from 'react-tooltip';
import { ItemTypes, errorLogging } from '../../constants';
import CourseElement from '../staticCourseElement';
import '../draggableCourse/draggableCourse.scss';

const loggingErrorsInPlaceholderCourse = (message) => {
  errorLogging('app/src/components/placeholderCourse.js', message);
};

const source = {
  beginDrag(props) {
    ReactTooltip.hide();
    // props.setDraggingState(true, props.catalogCourse);
    // props.setDraggingFulfilledStatus(props.catalogCourse.id);
    return props;
  },
  endDrag(props, monitor) {
    try {
      if (!monitor.didDrop()) {
        if (props.sourceTerm) {
          props.removeCustomCourse(props.customCourse.id, props.sourceTerm).then(() => { // This needs to become something with the ID?
          });
        }
      }
    } catch (e) {
      loggingErrorsInPlaceholderCourse(e);
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
    console.log(this.props.custom);
    console.log(this.props.sourceTerm);
    return this.props.connectDragSource(
      <div>
        <CourseElement
          custom={this.props.custom}
          showIcon
          icon="close"
          onIconClick={() => this.props.removeCustomCourse(this.props.customCourse.id, this.props.sourceTerm)} // This also needs to use the ID?
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
