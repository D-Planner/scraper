import React from 'react';
import './loadingWheel.scss';

const LoadingWheel = (props) => {
  if (props.loading) {
    return (
      <div className="loading-spinner" />
    );
  } else {
    return null;
  }
};

export default LoadingWheel;
