import React from 'react';
import classNames from 'classnames';

import './term.scss';

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
          const { subject, number, timeslot } = course;
          return (
            <div className="course" key={course.id}>
              <div className="course-number">
                {`${subject}${number}`}
              </div>
              <div className="course-timeslot">
                {timeslot}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Term;
