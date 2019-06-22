import React from 'react';
import DialogWrapper from '../dialogWrapper';

import './turnOffTerm.scss';

/** ensures a user meant to delete a plan before deleting it */
const TurnOffTerm = (props) => {
  return (
    <DialogWrapper {...props}>
      <div className="new-plan-content">
        <div className="description">Are you sure you want to turn off this term?</div>
        <div className="warning">Warning: You will lose any courses currently in this term</div>
      </div>
    </DialogWrapper>
  );
};

export default TurnOffTerm;
