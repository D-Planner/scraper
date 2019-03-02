import React from 'react';
import classNames from 'classnames';
import DraggableCourse from './draggableCourse';

import '../style/term.scss';

const Term = (props) => {
  const termClass = classNames({
    term: true,
    offterm: props.offTerm,
  });
  const onButtonClass = classNames({
    'toggle-button': true,
    active: !props.offTerm,
  });
  const offButtonClass = classNames({
    'toggle-button': true,
    active: props.offTerm,
  });
  return (
    <div className={termClass}>
      <div className="header">
        <div>{props.name}</div>
        <div className="offterm-toggle">
          <span className={onButtonClass}>on</span>
          <span className={offButtonClass}>off</span>
        </div>
      </div>
      <div className="content">
        {props.courses.map((course) => {
          return (
            <div className="course"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DraggableCourse key={course.id}
                course={course}
                offTerm={props.offTerm}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Term;
