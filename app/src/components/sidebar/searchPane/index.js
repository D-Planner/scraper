import React from 'react';
import classNames from 'classnames';
import searchIcon from '../../../style/searchSimple.svg';

import './searchPane.scss';

const SearchPane = (props) => {
  const paneClass = classNames({
    search: true,
    pane: true,
    active: props.active,
  });

  return (
    <div className={paneClass} onClick={props.activate} role="presentation">
      <div className="search-header">
        <img className="search-icon" src={searchIcon} alt="search" />
        <input type="text" className="search-input" placeholder="Search" />
      </div>
    </div>
  );
};

export default SearchPane;
