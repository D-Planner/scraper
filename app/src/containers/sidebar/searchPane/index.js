import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import searchIcon from '../../../style/searchSimple.svg';
import arrowDropDown from '../../../style/arrowDropDown.svg';

import './searchPane.scss';
import DraggableCourse from '../../../components/draggableCourse';

const SearchPane = (props) => {
  const paneClass = classNames({
    search: true,
    pane: true,
    active: props.active,
  });

  const [searchText, setSearchText] = useState('');

  // Allows a user to search by the query entered in the search input
  const search = (query) => {
    setSearchText(query);
    props.search(query);
  };

  // Clears the search input when the component updates to go inactive
  useEffect(() => {
    if (!props.active) {
      search('');
    }
  }, [props.active]);

  return (
    <div className={paneClass} onClick={props.activate} role="presentation">
      <div className="pane-header">
        <img className="dropdown-icon" src={arrowDropDown} alt="search" />
        <input type="text" className="search-input" placeholder="Search" value={searchText} onChange={(e) => { search(e.target.value); }} />
        <img className="search-icon" src={searchIcon} alt="search" />
      </div>
      <div className="pane-content">
        {props.results.length
          ? props.results.map((course) => {
            return <DraggableCourse course={course} />;
          })
          : (<div />)}
      </div>
    </div>
  );
};

export default SearchPane;