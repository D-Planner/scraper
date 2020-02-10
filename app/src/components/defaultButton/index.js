import React from 'react';
import './defaultButton.scss';

const DefaultButton = (props) => {
  return (
    <button type="button" className="default-button-container" onClick={props.click} style={{ width: props.width, marginLeft: 'auto', marginRight: 'auto' }}>
      <div className="button-cover"><div className="button-text">{props.label}</div></div>
    </button>
  );
};

export default DefaultButton;
