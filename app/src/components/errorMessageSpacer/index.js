import React from 'react';
import './errorMessageSpacer.scss';

const ErrorMessageSpacer = (props) => {
  console.log('filled', props.errorMessage != null ? ' filled' : '');
  return (<div className={`error-message-spacer${props.errorMessage != null ? ' filled' : ''}`}>{props.errorMessage}</div>);
};

export default ErrorMessageSpacer;
