import React from 'react';
import classNames from 'classnames';
import { DropTarget as TermTarget } from 'react-dnd';
import DraggableCourse from './draggableCourse';

import '../style/term.scss';
import { ItemTypes } from '../constants';

const termTarget = {
  drop: (props, monitor) => {
    if (props.term.off_term) {
      return;
    }

    console.log('wtf');
    const draggedCourse = monitor.getItem();
    props.addCourseToTerm(draggedCourse, props.term);
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
    width: '100%',
    height: '100%',
  });
  const onButtonClass = classNames({
    'toggle-button': true,
    active: !props.term.off_term,
  });
  const offButtonClass = classNames({
    'toggle-button': true,
    active: props.term.off_term,
  });
  return props.connectDropTarget(
    <div className={termClass}>
      <div className="header">
        <div>{props.term.name}</div>
        <div className="offterm-toggle">
          <span className={onButtonClass}>on</span>
          <span className={offButtonClass}>off</span>
        </div>
      </div>
      <div className="content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        {props.term.courses.map((course) => {
          console.log(course);
          return (
            <div className="course" style={{ margin: '5px' }} key={course.id}>
              <DraggableCourse
                course={course}
                offTerm={props.term.off_term}
              />
            </div>
          );
        })}
      </div>
    </div>,
  );
};

// eslint-disable-next-line new-cap
export default TermTarget(ItemTypes.COURSE, termTarget, collect)(Term);
