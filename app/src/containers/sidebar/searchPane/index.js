/* eslint-disable no-case-declarations */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import filterIcon from '../../../style/filter.svg';
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

  // const [searchText, setSearchText] = useState('');
  const [wcs, setWC] = useState('');
  const [distribs, setDistrib] = useState('');

  // Allows a user to search by the query entered in the search input

  // Clears the search input when the component updates to go inactive
  useEffect(() => {
    if (props.searchQuery.length !== 0) {
      const queryParsed = {
        title: props.searchQuery,
        department: props.searchQuery.split(' ')[0].toUpperCase(),
        number: props.searchQuery.split(' ')[1],
        distribs,
        wcs,
      };
      props.search(queryParsed);
    }
  }, [props.searchQuery, wcs, distribs]);

  return (
    <div className={paneClass} onClick={props.activate} role="presentation">
      <div className="pane-header">
        <button type="button" className="search-config-button">
          <img className="search-config-icon" src={arrowDropDown} alt="filter" />
        </button>
        <input type="text"
          className="search-input"
          placeholder="Search for courses"
          value={props.searchQuery}
          onChange={(e) => {
            props.setSearchQuery(e.target.value);
          }}
        />
        <button type="button" className="search-config-button">
          <img className="search-config-icon" src={filterIcon} alt="filter" />
          <div className="option-menu">

            <div className="option-menu-option">
              option 1
            </div>
            <div className="option-menu-option">
              option 2
            </div>
            <div className="option-menu">
              <div className="option-menu-option">
                sub option 1
              </div>
              <div className="option-menu-option">
                sub option 2
              </div>
            </div>
          </div>
        </button>
      </div>
      {props.active
        ? (
          <div className="pane-content">

            <div className="filters">
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
                      <option value={g} key={g}>{GenEds[g].fullName} ({g})</option>
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
                      <option value={g} key={g}>{GenEds[g].fullName} ({g})</option>
                    );
                  })
                }
              </select>
            </div>
            <div className="search-results">
              {props.results.length
                ? props.results.map((course) => {
                  return (
                    <div className="result-row" key={course.id}>
                      <div className="paneCourse">
                        <DraggableCourse key={course.id} course={course} setDraggingFulfilledStatus={props.setDraggingFulfilledStatus} />
                        <div className={`dot ${course.offered ? 'success' : 'error'}`} style={{ 'margin-left': '5px' }} data-tip />
                        <ReactTooltip place="right" type="dark" effect="float">
                          {course.offered ? 'Offered this term' : 'Not offered this term'}
                        </ReactTooltip>
                      </div>
                      <div id="course-spacer-large" />
                    </div>
                  );
                })
                : (<div className="no-search">Search for courses!</div>)}
            </div>
          </div>
        ) : null
          }
    </div>
  );
};


export default SearchPane;
