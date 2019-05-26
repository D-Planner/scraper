import React from 'react';
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
    showOk: false,
  };
  props.showDialog(DialogTypes.COURSE_INFO, dialogOptions);
};

const UserCourse = (props) => {
  const { catalogCourse } = props;

  return props.connectDragSource(
    <div>
      <div className="popover" onClick={() => showCourseInfoDialog(props)} role="button" tabIndex="0">
        <div className="course">
          <div>
            {catalogCourse.department}
            {catalogCourse.number}
          </div>
          <div>
            {catalogCourse.timeslot}
          </div>
        </div>
      </div>
    </div>,
  );
};


// eslint-disable-next-line new-cap
export default connect(null, { showDialog })(DraggableUserCourse(ItemTypes.COURSE, source, collect)(UserCourse));
