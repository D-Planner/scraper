/* eslint-disable no-case-declarations */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import {
  setFilters, clearFilters, addCourseToFavorites, removeCourseFromFavorites, fetchUser,
} from '../../../actions';
import filterIcon from '../../../style/filter.svg';
import searchIcon from '../../../style/search-purple.svg';
import { DialogTypes } from '../../../constants';
import DraggableCourse from '../../../components/draggableCourse';
import LoadingWheel from '../../../components/loadingWheel';
import './searchPane.scss';

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

  const [results, setResults] = useState('');

  useEffect(() => {
    setResults(props.results);
  }, [props.results]);

  const resort = (method) => {
    const sortedResults = Object.assign([], props.results.sort((c1, c2) => {
      switch (method) {
        case 'Sort by alphabet':
          return c1.name >= c2.name ? 1 : -1;
        case 'Sort by layup-list score': // This doesn't work. Most classes have a layuplist score of 0.
          return c1.layup_score >= c2.layup_score ? 1 : -1;
        case 'Sort by quality score':
          return c1.quality_score <= c2.quality_score ? 1 : -1;
        case 'Sort by median':
          if (c2.avg_median === 'N/A') return -1;
          if (c1.avg_median === 'N/A') return 1;
          return -1;
        case 'Sort by number':
          return (c1.number >= c2.number) ? 1 : -1;
        default:
          return 1;
      }
    }));
    setResults(sortedResults);
  };

  const useFilters = () => {
    const wcs = props.wcs.filter(e => e.checked).map(e => e.name);
    const distribs = props.distribs.filter(e => e.checked).map(e => e.tag);
    const offered = props.offered.filter(e => e.checked).map(e => e.term);
    props.useFilterToSearch(wcs, distribs, offered);
  };

  // const clearCurFilters = () => {
  //   props.clearFilters();
  //   props.useFilterToSearch([], [], []);
  // };

  const showFilterDialog = () => {
    const dialogOptions = {
      title: 'Search filters',
      size: 'md',
      showOk: false,
      // okText: 'Apply',
      // noText: 'Clear',
      // onOk: useFilters,
      // onNo: clearCurFilters,
      onClose: useFilters,
    };
    props.showDialog(DialogTypes.FILTER, dialogOptions);
  };

  return (
    <div className={paneClass} onClick={props.activate} role="presentation">
      <div className="pane-header">
        <img className="search-config-icon" src={searchIcon} alt="search" />
        <input type="text"
          className={`search-input${props.resultsLoading ? ' small' : ''}`}
          placeholder="Search for courses"
          value={props.searchQuery}
          tabIndex={-1}
          onChange={(e) => {
            props.useQueryToSearch(e.target.value);
          }}
          ref={ref}
        />
        {props.resultsLoading ? <LoadingWheel /> : null}
        <button type="button" className="search-config-button" onClick={showFilterDialog}>
          <img className="search-config-icon" src={filterIcon} alt="filter" />
        </button>
      </div>
      {props.active
        ? (
          <div className="pane-content">
            <select className="sort-picker"
              onChange={(e) => {
                resort(e.target.value);
              }}
            >
              {
                ['Sort by number', 'Sort by alphabet', 'Sort by layup-list score', 'Sort by median', 'Sort by quality score'].map((method) => {
                  return (
                    <option value={method} key={method}>{method}</option>
                  );
                })
              }
            </select>
            <div className="search-results">
              {results.length
                ? results.map((course) => {
                  // Find whether this course's ID matches with any ID in the user's favorites
                  if (props.user.favorite_courses.findIndex(c => c._id === course._id) !== -1) {
                    return (
                      <div className="result-row" key={course.id}>
                        <div className="paneCourse">
                          <DraggableCourse key={course.id} course={course} setDraggingFulfilledStatus={props.setDraggingFulfilledStatus} currTerm={props.currTerm} showIcon icon="bookmarkFilled" onIconClick={() => props.removeCourseFromFavorites(course.id)} />
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
  offered: state.filters.offered,
});


export default connect(mapStateToProps, {
  setFilters,
  clearFilters,
  addCourseToFavorites,
  removeCourseFromFavorites,
  fetchUser,
})(SearchPane);
