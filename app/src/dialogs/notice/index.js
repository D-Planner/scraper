import React from 'react';
import DialogWrapper from '../dialogWrapper';

/** ensures a user meant to delete a plan before deleting it */
const noticeDialog = (props) => {
  return (
    <DialogWrapper {...props} />
  );
};

export default noticeDialog;
