import React from 'react';
import classNames from 'classnames';

import './PhantomCourse.scss';

const renderLikelyTermInfo = (props, certainNot) => {
  if (props.certainOffered) return <div className="good">Offered</div>;
  if (!props.likelyTerm || !props.likelyYear) {
    return certainNot ? <div className="error">Not offered!</div> : <div className="warning">Unlikely to be offered</div>;
  } else if (props.likelyTerm && props.likelyYear) {
    return certainNot ? <div className="warning">Unlikely to be offered</div> : <div className="good">Likely offered</div>;
  } else {
    return null;
  }
};

const PhantomCourse = (props) => {
  return (
    <div className={classNames({
      'phantom-course': true,
    })}
    >
      {props.dragStatus === 'error' ? <div className="error">Prereq missing</div> : null}
      {props.dragStatus === 'warning' ? <div className="warning">May have other reqs</div> : null}
      {renderLikelyTermInfo(props, props.currentTermOfferedError)}
    </div>
  );
};

export default PhantomCourse;