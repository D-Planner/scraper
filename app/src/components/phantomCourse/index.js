import React from 'react';
import classNames from 'classnames';

import './PhantomCourse.scss';

const renderLikelyTermInfo = (props, certain) => {
  if (certain) {
    return (
      <>
        {!props.likelyTerm || !props.likelyYear ? <div className="error">Not offered!</div> : null}
      </>
    );
  } else {
    return (
      <>
        {!props.likelyTerm || !props.likelyYear ? <div className="warning">Unlikely to be offered</div> : null}
      </>
    );
  }
};

const PhantomCourse = (props) => {
  return (
    <div className={classNames({
      'phantom-course': true,
    //   likely: likelyTerm || likelyYear,
    //   unlikely: !likelyTerm || !likelyYear,
    //   error: currentTermOfferedError,
    })}
    >
      {props.dragStatus === 'error' ? <div className="error">Prereq missing</div> : null}
      {props.dragStatus === 'warning' ? <div className="warning">May have other reqs</div> : null}
      {renderLikelyTermInfo(props, props.currentTermOfferedError)}
      {((props.dragStatus === '') && !props.currentTermOfferedError && props.likelyTerm && props.likelyYear) ? <div className="good">Drag me here!</div> : null}
    </div>
  );
};

export default PhantomCourse;
