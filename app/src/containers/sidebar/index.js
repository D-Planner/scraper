import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SearchPane from './searchPane';
import RequirementsPane from './requirementsPane';
import BookmarksPane from './bookmarksPane';
import './sidebar.scss';
import { DialogTypes } from '../../constants';
import {
  addCourseToFavorites, courseSearch, fetchBookmarks, fetchUser, showDialog, declareMajor,
} from '../../actions';

const paneTypes = {
  SEARCH: 'SEARCH',
  REQUIREMENTS: 'REQUIREMENTS',
  BOOKMARKS: 'BOOKMARKS',
};

/**
 * @name Sidebar
 * @description displays important information in panes on the side of the dplan component
 */
const Sidebar = (props) => {
  const [activePane, setActivePane] = useState(paneTypes.REQUIREMENTS);

  useEffect(() => {
    props.fetchUser();
  }, []);

  const addToBookmarks = (courseId) => {
    props.addCourseToFavorites(courseId);
  };

  const showDeclareDialog = () => {
    const opts = {
      title: 'Declare New Major',
      okText: 'Enroll',
      onOk: (majorID) => {
        props.declareMajor(majorID);
        setTimeout(() => props.fetchUser(), 100);
      },
    };
    props.showDialog(DialogTypes.DECLARE_MAJOR, opts);
  };
  return (
    <div className="sidebar">
      <SearchPane
        active={activePane === paneTypes.SEARCH}
        activate={() => setActivePane(paneTypes.SEARCH)}
        search={props.courseSearch}
        results={props.searchResults}
      />
      <RequirementsPane
        active={activePane === paneTypes.REQUIREMENTS}
        activate={() => setActivePane(paneTypes.REQUIREMENTS)}
        majors={props.user.majors}
        showDeclareDialog={showDeclareDialog}
        // distribs={props.planCourses.map(c => c.course.distrib)}
        // wcs={props.planCourses.map(c => c.course.wc)}
        userCourses={props.planCourses}
      />
      <BookmarksPane
        active={activePane === paneTypes.BOOKMARKS}
        activate={() => setActivePane(paneTypes.BOOKMARKS)}
        bookmarks={props.user.favorite_courses}
        addToBookmarks={addToBookmarks}
      />
    </div>
  );
};


const mapStateToProps = state => ({
  bookmarks: state.courses.bookmarks,
  searchResults: state.courses.results,
  user: state.user.current,
});

export default connect(mapStateToProps, {
  addCourseToFavorites, courseSearch, fetchBookmarks, fetchUser, showDialog, declareMajor,
})(Sidebar);
