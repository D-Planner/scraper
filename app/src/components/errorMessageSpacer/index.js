import React from 'react';
import './errorMessageSpacer.scss';

const ErrorMessageSpacer = (props) => {
  return (<div className={`error-message-spacer${props.errorMessage != null ? ' filled' : ''}`} style={props.textColor ? { color: props.textColor } : null}>{props.errorMessage && props.spacerElement ? `${props.spacerElement} ` : ''}{props.errorMessage}{props.errorMessage && props.spacerElement ? ` ${props.spacerElement}` : ''}</div>);
};

export default ErrorMessageSpacer;
