import React from 'react';
import './tooSmall.scss';

const tooSmall = (props) => {
  return (
    <div id="screen-too-small">
      <p>
        DPlanner is not yet available on mobile! Please use a device with a larger sceen.
      </p>
    </div>
  );
};

export default tooSmall;
