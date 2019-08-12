/* eslint-disable no-case-declarations */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import searchIcon from '../../../style/searchSimple.svg';
import arrowDropDown from '../../../style/arrowDropDown.svg';

import './searchPane.scss';
import DraggableCourse from '../../../components/draggableCourse';

import { GenEds } from '../../../constants';

/**
 * @name SearchPane
 * @description allows a user to search specific courses right in the sidebar
 */
const SearchPane = (props) => {
  const paneClass = classNames({
    search: true,
    pane: true,
    active: props.active,
  });

  const [searchText, setSearchText] = useState('');
  const [wcs, setWC] = useState('');
  const [distribs, setDistrib] = useState('');

  // Allows a user to search by the query entered in the search input

  // Clears the search input when the component updates to go inactive
  useEffect(() => {
    if (searchText.length !== 0) {
      const queryParsed = {
        department: searchText.split(' ')[0].toUpperCase(),
        number: searchText.split(' ')[1],
        distribs,
        wcs,
      };
      props.search(queryParsed);
    }
  }, [searchText, wcs, distribs]);

  return (
    <div className={paneClass} onClick={props.activate} role="presentation">
      <div className="pane-header">
        <img className="dropdown-icon" src={arrowDropDown} alt="search" />
        <input type="text"
          className="search-input"
          placeholder="Search"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
        <img className="search-icon" src={searchIcon} alt="search" />
      </div>
      {props.active
        ? (
          <div>
            <select className="gened-picker"
              onChange={(e) => {
                setWC(e.target.value);
              }}
            >
              <option value="">None</option>
              {
          Object.keys(GenEds).filter((g) => {
            return g.length <= 2;
          }).map((g) => {
            return (
              <option value={g}>{GenEds[g].fullName} ({g})</option>
            );
          })
        }
            </select>
            <select className="gened-picker"
              onChange={(e) => {
                setDistrib(e.target.value);
              }}
            >
              <option value="">None</option>
              {
          Object.keys(GenEds).filter((g) => {
            return g.length > 2;
          }).map((g) => {
            return (
              <option value={g}>{GenEds[g].fullName} ({g})</option>
            );
          })
        }
            </select>
            <div className="pane-content">
              {props.results.length
                ? props.results.map((course) => {
                  return <DraggableCourse key={course.id} course={course} />;
                })
                : (<div />)}
            </div>
          </div>
        ) : null
          }
    </div>
  );
};

export default SearchPane;
