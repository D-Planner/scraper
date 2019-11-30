/* eslint-disable no-case-declarations */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import filterIcon from '../../../style/filter.svg';
import arrowDropDown from '../../../style/arrowDropDown.svg';
import { DialogTypes } from '../../../constants';

import './searchPane.scss';
import DraggableCourse from '../../../components/draggableCourse';
import {
  setFilters, clearFilters, addCourseToFavorites, fetchUser,
} from '../../../actions';


/**
 * @name SearchPane
 * @description allows a user to search specific courses right in the sidebar
 * @param ref UNUSED, for focus selecting
 */
const SearchPane = React.forwardRef((props, ref) => {
  const paneClass = classNames({
    search: true,
    pane: true,
    active: props.active,
  });

  // const [searchText, setSearchText] = useState('');
  const [sort, setSort] = useState('Sort by alphabet');
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

  const useFilters = () => {
    console.log(sort);
    setWC(props.wcs.filter(e => e.checked).map(e => e.name));
    setDistrib(props.distribs.filter(e => e.checked).map(e => e.name));
    setOfferedNextTerm(props.offeredNextTerm);
    console.log(offeredNextTerm);
  };

  const clearCurFilters = () => {
    setWC([]);
    setDistrib([]);
    setOfferedNextTerm(false);
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
      onNo: clearCurFilters,
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
          tabIndex={-1}
          onChange={(e) => {
            props.setSearchQuery(e.target.value);
          }}
          ref={ref}
        />
        <button type="button" className="search-config-button" onClick={showFilterDialog}>
          <img className="search-config-icon" src={filterIcon} alt="filter" />
        </button>
      </div>
      {props.active
        ? (
          <div className="pane-content">
            <select className="sort-picker"
              onChange={(e) => {
                setSort(e.target.value);
              }}
            >
              {
                ['Sort by alphabet', 'Sort by layup-list score', 'Sort by median'].map((method) => {
                  return (
                    <option value={method} key={method}>{method}</option>
                  );
                })
              }
            </select>
            <div className="search-results">
              {props.results.length
                ? props.results.map((course) => {
                  // Find whether this course's ID matches with any ID in the user's favorites
                  if (props.user.favorite_courses.findIndex(c => c._id === course._id) !== -1) {
                    return (
                      <div className="result-row" key={course.id}>
                        <div className="paneCourse">
                          <DraggableCourse key={course.id} course={course} setDraggingFulfilledStatus={props.setDraggingFulfilledStatus} currTerm={props.currTerm} showIcon icon="bookmarkFilled" onIconClick={() => props.addCourseToFavorites(course.id)} />
                        </div>
                        <div id="course-spacer-large" />
                      </div>
                    );
                  } else {
                    return (
                      <div className="result-row" key={course.id}>
                        <div className="paneCourse">
                          <DraggableCourse key={course.id} course={course} setDraggingFulfilledStatus={props.setDraggingFulfilledStatus} currTerm={props.currTerm} showIcon icon="bookmarkEmpty" onIconClick={() => props.addCourseToFavorites(course.id)} />
                        </div>
                        <div id="course-spacer-large" />
                      </div>
                    );
                  }
                })
                : (<div className="no-search">Search for courses!</div>)}
            </div>
          </div>
        ) : null
          }
    </div>
  );
});

const mapStateToProps = state => ({
  distribs: state.filters.distribs,
  wcs: state.filters.wcs,
  offeredNextTerm: state.filters.offeredNextTerm,
  user: state.user.current,
});


export default connect(mapStateToProps, {
  setFilters,
  clearFilters,
  addCourseToFavorites,
  fetchUser,
})(SearchPane);
