import React from 'react';
import DialogWrapper from '../dialogWrapper';

import './deletePlan.scss';

const NewPlan = (props) => {
  return (
    <DialogWrapper {...props}>
      <div className="new-plan-content">
        <div className="description">Are you sure you want to delete this plan?</div>
        <div className="warning">Warning: This cannot be undone.</div>
      </div>
    </DialogWrapper>
  );
};

export default NewPlan;
