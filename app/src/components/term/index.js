import React from 'react';
import classNames from 'classnames';
import { DropTarget as TermTarget } from 'react-dnd';
import DraggableCourse from '../draggableCourse';
import HourSelector from '../hourSelector';

import './term.scss';
import { ItemTypes } from '../../constants';

// turnOffTerm={this.turnOffTerm}
// turnOnTerm={this.turnOnTerm}


const termTarget = {
  drop: (props, monitor) => {
    const item = monitor.getItem();

    // if a course was dragged from another source term,
    // then delete it from that term and add it to this one
    if (!props.term.off_term) {
      if (item.sourceTerm) {
        props.removeCourseFromTerm(item.course, item.sourceTerm);
      }

      props.addCourseToTerm(item.course, props.term);

      // return an object containing the current term
      return { destinationTerm: props.term };
    }

    return null;
  },
};

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
  };
};

const Term = (props) => {
  const termClass = classNames({
    term: true,
    offterm: props.term.off_term,
  });
  const onButtonClass = classNames({
    'toggle-button': true,
    active: !props.term.off_term,
  });
  const offButtonClass = classNames({
    'toggle-button': true,
    active: props.term.off_term,
  });
  const onButtonClick = () => {
    console.log('clicked!');
    // console.log(props.term.offterm)
  };

  return props.connectDropTarget(
    <div className={termClass}>
      <div className="header">
        <div className="term-name">{props.term.name}</div>
        <div className="offterm-toggle">
          <span onClick={onButtonClick} role="button" tabIndex={-1} id="on-off-button" className={onButtonClass}>ON</span>
          <span onClick={onButtonClick} role="button" tabIndex={-1} id="on-off-button" className={offButtonClass}>OFF</span>
        </div>
      </div>
      {renderContent(props)}
    </div>,
  );
};

const renderContent = (props) => {
  if (props.term.courses.length === 0 && !props.term.off_term) {
    return (
      <div className="term-content no-content">
        <p>Drag-n-drop your courses here!</p>
      </div>
    );
  }
  return (
    <div className="term-content">
      {props.term.courses.map((course) => {
        return (
          <div className="course-row">
            <DraggableCourse
              key={course.id}
              course={course}
              sourceTerm={props.term}
              removeCourseFromTerm={() => {
                props.removeCourseFromTerm(course, props.term);
              }}
            />
            <div>
              <HourSelector timeslots={course.timeslot} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// eslint-disable-next-line new-cap
export default TermTarget(ItemTypes.COURSE, termTarget, collect)(Term);
