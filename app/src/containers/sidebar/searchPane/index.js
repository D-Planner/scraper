/* eslint-disable no-case-declarations */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import filterIcon from '../../../style/filter.svg';
import arrowDropDown from '../../../style/arrowDropDown.svg';
import { DialogTypes, GenEds } from '../../../constants';

import './searchPane.scss';
import DraggableCourse from '../../../components/draggableCourse';
import { setFilters, clearFilters } from '../../../actions';


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
  const [offeredNextTerm, setOfferedNextTerm] = useState(false);

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
      // console.log(props.resultStamp);
      props.stampIncrement((props.resultStamp + 1));
      props.search(queryParsed, props.resultStamp);
    }
  }, [props.searchQuery, wcs, distribs]);

  const useFilters = (filters) => {
    props.setFilters(filters);
    setWC(filters.wcs.filter(e => e.checked).map(e => e.name));
    setDistrib(filters.distribs.filter(e => e.checked).map(e => e.name));
    setOfferedNextTerm(filters.offeredNextTerm);
    console.log(offeredNextTerm);
  };

  const showFilterDialog = () => {
    const dialogOptions = {
      title: 'Search filters',
      size: 'md',
      showNo: true,
      okText: 'Apply',
      noText: 'Clear',
      onOk: useFilters,
      onNo: props.clearFilters,
    };
    props.showDialog(DialogTypes.FILTER, dialogOptions);
  };

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
        <button type="button" className="search-config-button" onClick={showFilterDialog}>
          <img className="search-config-icon" src={filterIcon} alt="filter" />
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
                        <DraggableCourse key={course.id} course={course} setDraggingFulfilledStatus={props.setDraggingFulfilledStatus} currTerm={props.currTerm} />
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


export default connect(null, { setFilters, clearFilters })(SearchPane);
