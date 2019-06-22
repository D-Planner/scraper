import React from 'react';
import plusIcon from '../../style/plus.svg';

import './searchResultRow.scss';

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
const icons = importSVGs(require.context('../../style/distrib_icons', false, /\.svg$/));

/** a single row of search results for the discover page */
const SearchResultRow = (props) => {
  return (
    <div className="result-row">
      <div className="name result-col">
        <div className="name-text">
          {`${props.course.department} ${props.course.number}`}
        </div>
        <button
          type="button"
          onClick={() => props.addCourseToFavorites(props.id)}
          className="add-course-button"
        >
          <img src={plusIcon} alt="add" />
        </button>
      </div>
      <div className="description result-col">
        <div className="description-text">
          {props.course.description}
        </div>
      </div>
      <div className="period result-col">
        {props.course.timeslot}
      </div>
      <div className="median result-col">
        {props.course.medians.length ? getMedians(props.course.medians) : 'N/A'}
      </div>
      <div className="distribs result-col">
        <div className="subjects">
          {getDistribIcon(props.course.distrib)}
        </div>
        <div className="wc">
          {getWCIcon(props.course.wc)}
        </div>
      </div>
    </div>
  );
};

// returns the letter grade value of the most recent course median
const getMedians = (medians) => {
  return qualityPtsToLetter[medians[0].avg_numeric_value];
};

const getDistribIcon = (distribName) => {
  if (!distribName) {
    return (<div className="icon" />);
  }
  const distribs = distribName.split(' or ');
  return distribs.map((distrib) => {
    return (<img key={distrib} src={icons[distrib.toLowerCase()]} alt={distrib} className="icon" />);
  });
};

const getWCIcon = (wcName) => {
  if (!wcName) {
    return (<div className="icon" />);
  }
  return (<img src={icons[`wc_${wcName.toLowerCase()}`]} alt={wcName} className="icon" />);
};

const qualityPtsToLetter = {
  0: 'E',
  3: 'D',
  3.5: 'D+/D',
  4: 'D+',
  4.5: 'C-/D+',
  5: 'C-',
  5.5: 'C/C-',
  6: 'C',
  6.5: 'C+/C',
  7: 'C+',
  7.5: 'B-/C+',
  8: 'B-',
  8.5: 'B/B-',
  9: 'B',
  9.5: 'B+/B',
  10: 'B+',
  10.5: 'A-/B+',
  11: 'A-',
  11.5: 'A/A-',
  12: 'A',
};

export default SearchResultRow;
