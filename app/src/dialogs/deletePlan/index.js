import React from 'react';
import DialogWrapper from '../dialogWrapper';

import './deletePlan.scss';

/** ensures a user meant to delete a plan before deleting it */
const DeletePlan = (props) => {
  return (
    <DialogWrapper {...props}>
      <div className="new-plan-content">
        <div className="description">Are you sure you want to delete this plan?</div>
        <div className="warning">Warning: This cannot be undone.</div>
      </div>
    </DialogWrapper>
  );
};

export default DeletePlan;
