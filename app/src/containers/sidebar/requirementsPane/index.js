import React, { useState } from 'react';
import classNames from 'classnames';
import Majors from '../../majors';
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

/**
 * @name RequirementsPane
 * @description displays information on a user's distributive and major reqirements for a plan to check progress
 */
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

  const distribComplete = (name) => {
    return props.distribs.includes(name);
  };

  const wcComplete = (name) => {
    return props.distribs.includes(name);
  };

  const distribTypes = [
    {
      name: 'Arts',
      icon: icons.art,
      complete: distribComplete('ART'),
    },
    {
      name: 'Literature',
      icon: icons.lit,
      complete: distribComplete('LIT'),
    },
    {
      name: 'Thought, Meaning, and Value',
      icon: icons.tmv,
      complete: distribComplete('TMV'),
    },
    {
      name: 'International or Comparative Study',
      icon: icons.int,
      complete: distribComplete('INT'),
    },
    {
      name: 'Social Analysis',
      icon: icons.soc,
      complete: distribComplete('SOC'),
    },
    {
      name: 'Quantitative and Deductive Science',
      icon: icons.qds,
      complete: distribComplete('QDS'),
    },
    {
      name: 'Natural and Physical Science (LAB)',
      icon: icons.sla,
      complete: distribComplete('SLA'),
    },
    {
      name: 'Natural and Physical Science',
      icon: icons.sci,
      complete: distribComplete('SCI'),
    },
    {
      name: 'Technology and Applied Science (LAB)',
      icon: icons.tla,
      complete: distribComplete('TLA'),
    },
    {
      name: 'Technology and Applied Science',
      icon: icons.tas,
      complete: distribComplete('TAS'),
    },
    {
      name: 'Western Cultures',
      icon: icons.wc_w,
      complete: wcComplete('W'),
    },
    {
      name: 'Non-Western Cultures',
      icon: icons.wc_nw,
      complete: wcComplete('NW'),
    },
    {
      name: 'Culture and Identity',
      icon: icons.wc_ci,
      complete: wcComplete('CI'),
    },
  ];

  const renderDistribs = () => {
    return (
      <div className="reqs-list">
        {distribTypes.map((distrib) => {
          return (
            <div key={distrib.name} className="distrib-row">
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
          {props.majors.map((major) => {
            console.log(major);
            return (
              <div className="major" id={major.id}>
                <div className="major-header">
                  {major.name}
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return <Majors />;
      // return (
      //   <div className="no-major">
      //     <p>You are not enrolled in a major.</p>
      //     <button type="button" className="enroll-button" onClick={props.showDeclareDialog}>
      //       <p>Choose A Major</p>
      //     </button>
      //   </div>
      // );
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
