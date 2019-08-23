import React from 'react';
import DialogWrapper from '../dialogWrapper';

import './turnOffTerm.scss';

/** ensures a user meant to delete a plan before deleting it */
const TurnOffTerm = (props) => {
  return (
    <DialogWrapper {...props}>
      <div className="new-plan-content">
        <div className="description">Make this an off-term?</div>
        <div className="warning">You will lose any courses currently in this term.</div>
      </div>
    </DialogWrapper>
  );
};

export default TurnOffTerm;
