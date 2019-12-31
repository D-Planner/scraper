import React from 'react';
import './progressBar.scss';

export const ProgressBar = (props) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${props.percentage || 0}%` }} />
    </div>
  );
};
