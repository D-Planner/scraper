import React from 'react';
import './tooSmall.scss';

const tooSmall = (props) => {
  return (
    <div id="screen-too-small">
      <div className="title">Uh oh!</div>
      <div className="text">
        DPlanner is not yet available on mobile devices! Please use a device with a larger sceen.
      </div>
      {/* <div className="error-disclaimer">
        If you think you are seeing this message in error, please contact us at dplanner.official@gmail.com!
      </div> */}
    </div>
  );
};

export default tooSmall;
