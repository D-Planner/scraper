import React from 'react';
import DialogWrapper from '../dialogWrapper';

/** ensures a user meant to delete a plan before deleting it */
const errorDialog = (props) => {
  return (
    <DialogWrapper {...props}>
      <div className="new-plan-content">
        <div className="description">There was an error signing you in/up.</div>
        <div className="warning">{props.warning}</div>
      </div>
    </DialogWrapper>
  );
};

export default errorDialog;
