import React, { useState } from 'react';
import classNames from 'classnames';
import checkedIcon from '../../../style/checkboxChecked.svg';
import uncheckedIcon from '../../../style/checkboxUnchecked.svg';

import './requirementsPane.scss';

// import all svgs in from require.context, found later
const importSVGs = (r) => {
  const icons = {};
  r.keys().forEach((item) => {
    // strip extension and ./ at beginning of file
    const itemName = item.replace('./', '').replace('.svg', '');

    // require the icon and insert its reference into the icons dictionary
    icons[itemName] = r(item);
  });
  return icons;
};

// import all svg files in the ../style/distrib_icons directory
const icons = importSVGs(require.context('../../../style/distrib_icons', false, /\.svg$/));

const RequirementsPane = (props) => {
  const [distribsActive, setDistribsActive] = useState(true);

  const distribsButtonClass = classNames({
    distribs: true,
    toggle: true,
    active: distribsActive,
  });
  const majorButtonClass = classNames({
    major: true,
    toggle: true,
    active: !distribsActive,
  });

  const setDistribsTabActive = (flag) => {
    setDistribsActive(flag);
  };

  const distribTypes = [
    {
      name: 'Arts',
      icon: icons.art,
      complete: false,
    },
    {
      name: 'Literature',
      icon: icons.lit,
      complete: false,
    },
    {
      name: 'Thought, Meaning, and Value',
      icon: icons.tmv,
      complete: false,
    },
    {
      name: 'International or Comparative Study',
      icon: icons.int,
      complete: false,
    },
    {
      name: 'Social Analysis',
      icon: icons.soc,
      complete: false,
    },
    {
      name: 'Quantitative and Deductive Science',
      icon: icons.qds,
      complete: false,
    },
    {
      name: 'Natural and Physical Science',
      icon: icons.sci,
      complete: false,
    },
    {
      name: 'Technology and Applied Science',
      icon: icons.tas,
      complete: false,
    },
    {
      name: 'Western Cultures',
      icon: icons.wc_w,
      complete: false,
    },
    {
      name: 'Non-Western Cultures',
      icon: icons.wc_nw,
      complete: false,
    },
    {
      name: 'Culture and Identity',
      icon: icons.wc_ci,
      complete: false,
    },
  ];

  const renderDistribs = () => {
    return (
      <div className="reqs-list">
        {distribTypes.map((distrib) => {
          return (
            <div className="distrib-row">
              <img className="icon" src={distrib.icon} alt={`${distrib.name} icon`} />
              <div className="distrib-name">{distrib.name}</div>
              <img className="checkbox" src={distrib.complete ? checkedIcon : uncheckedIcon} alt="checkbox" />
            </div>
          );
        })}
      </div>
    );
  };

  const renderMajorReqs = () => {
    if (props.majors.length > 0) {
      return (
        <div className="reqs-list">
          {props.majors.map((req) => {
            return (
              <div className="distrib-row">
                <div>yeet</div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="no-major">
          <p>You are not enrolled in a major.</p>
          <button type="button" className="enroll-button" onClick={props.showDeclareDialog}>
            <p>Choose A Major</p>
          </button>
        </div>
      );
    }
  };

  const paneClass = classNames({
    requirements: true,
    pane: true,
    active: props.active,
  });

  return (
    <div className={paneClass} onClick={props.activate} role="presentation">
      <div className="pane-header">
        <h1 className="pane-title">Requirements</h1>
        {props.active
          ? (
            <div className="requirements-toggle">
              <button type="button" className={distribsButtonClass} onClick={() => setDistribsTabActive(true)}>Distribs</button>
              <button type="button" className={majorButtonClass} onClick={() => setDistribsTabActive(false)}>Major</button>
            </div>
          )
          : <div /> }
      </div>
      {distribsActive ? renderDistribs() : renderMajorReqs()}
    </div>
  );
};

export default RequirementsPane;
