import React from 'react';
import './progressBar.scss';

export const ProgressBar = (props) => {
  console.log('percentage', props.percentage);
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${props.percentage}%` }} />
    </div>
  );
};
