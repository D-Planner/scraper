import React from 'react';
import HeaderMenu from '../headerMenu';
import BUG_REPORT_URL from '../../constants';
import uhOhFeature from '../../../assets/uh-oh.svg';
import './tooSmall.scss';

export const minWidth = 1350;
export const minHeight = 500;
export const contactEmail = 'info@d-planner.com';

const tooSmall = (props) => {
  const menuOptions = [{ name: 'Report an error', callback: () => window.open(BUG_REPORT_URL) }];

  return (
  // <div id="screen-too-small">
  //   <div className="title">Uh oh!</div>
  //   <div className="text">
  //     {`DPlanner is not yet available in resolutions less than ${minWidth}px by ${minHeight}px! Please use a device with a larger sceen.`}
  //   </div>
  //   <div className="error-disclaimer">
  //     If you think you are seeing this message in error, please contact us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
  //   </div>
  // </div>

    <div style={{ height: '100vh' }}>
      {/* <HeaderMenu menuOptions={menuOptions} /> */}
      <div className="fallback-container">
        <img className="fallback-main-feature" src={uhOhFeature} alt="404" style={{ marginBottom: '73px' }} />
        <h1 className="dark" style={{ marginBottom: '8px' }}>We can’t yet support your screen size!</h1>
        <h3 className="dark" style={{ marginBottom: '36px' }}>We’re still a work in progress, and that means that we aren’t yet able to support screens this small. We’re sorry for the inconvenience :(</h3>
        <a className="dark" href={BUG_REPORT_URL} target="_blank" rel="noopener noreferrer" style={{ marginTop: '11px', marginBottom: '8vh' }}>Does this keep happening? Report an error here</a>
      </div>
    </div>
  );
};

export default tooSmall;
