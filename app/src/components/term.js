import React from 'react';
import classNames from 'classnames';
import { DropTarget as TermTarget } from 'react-dnd';
import DraggableCourse from './draggableCourse';

import '../style/term.scss';
import { ItemTypes } from '../constants';

const termTarget = {
  drop: (targetProps, monitor) => {
    console.log(monitor.getItem());
    return {};
  },
  hover: (targetProps, monitor) => {
    return {};
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
    offterm: props.offTerm,
    width: '100%',
    height: '100%',
  });
  const onButtonClass = classNames({
    'toggle-button': true,
    active: !props.offTerm,
  });
  const offButtonClass = classNames({
    'toggle-button': true,
    active: props.offTerm,
  });
  return props.connectDropTarget(
    <div className={termClass}>
      <div className="header">
        <div>{props.name}</div>
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
        {props.courses.map((course) => {
          return (
            <div className="course" style={{ margin: '5px' }} key={course.id}>
              <DraggableCourse
                course={course}
                offTerm={props.offTerm}
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
