import React from 'react';
import './tooSmall.scss';

export const minWidth = 0;
export const minHeight = 0;
export const contactEmail = 'info@d-planner.com';

const tooSmall = (props) => {
  return (
    <div id="screen-too-small">
      <div className="title">Uh oh!</div>
      <div className="text">
        {`DPlanner is not yet available in resolutions less than ${minWidth}px by ${minHeight}px! Please use a device with a larger sceen.`}
      </div>
      <div className="error-disclaimer">
        If you think you are seeing this message in error, please contact us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </div>
    </div>
  );
};

export default tooSmall;
