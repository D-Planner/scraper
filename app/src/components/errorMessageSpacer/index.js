import React from 'react';
import './errorMessageSpacer.scss';

const ErrorMessageSpacer = (props) => {
  return (<div className="error-message-spacer">{props.errorMessage}</div>);
};

export default ErrorMessageSpacer;
