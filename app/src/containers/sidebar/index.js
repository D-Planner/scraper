import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SearchPane from './searchPane';
import RequirementsPane from './requirementsPane';
import BookmarksPane from './bookmarksPane';
import './sidebar.scss';
import { DialogTypes } from '../../constants';
import {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor,
} from '../../actions';

export const paneTypes = {
  SEARCH: 'SEARCH',
  REQUIREMENTS: 'REQUIREMENTS',
  BOOKMARKS: 'BOOKMARKS',
};

/**
 * @name Sidebar
 * @description displays important information in panes on the side of the dplan component
 */
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
    };
  }

  componentDidMount() {
    this.props.fetchUser();
    console.log(this.props.openPane ? this.props.openPane : paneTypes.REQUIREMENTS);
  }

  componentDidUpdate() {
    console.log(this.props);
  }

  addToBookmarks = (courseId) => {
    this.props.addCourseToFavorites(courseId);
  }

  showDeclareDialog = () => {
    const opts = {
      title: 'Declare New Major',
      okText: 'Enroll',
      onOk: (majorID) => {
        this.props.declareMajor(majorID);
        setTimeout(() => this.props.fetchUser(), 100);
      },
    };
    this.props.showDialog(DialogTypes.DECLARE_MAJOR, opts);
  }

  handlePaneSwitch = (type) => {
    console.log(type);
    if (type !== paneTypes.SEARCH) {
      this.setSearchQuery('');
      this.setActivePane(type);
    } else {
      this.setActivePane(type);
    }
  }

  setSearchQuery = (quiery) => {
    this.setState({ searchQuery: quiery });
  }

  render() {
    return (
      <div className="sidebar">
        <SearchPane
          active={this.props.openPane === paneTypes.SEARCH}
          activate={() => this.handlePaneSwitch(paneTypes.SEARCH)}
          setSearchQuery={this.setSearchQuery}
          searchQuery={this.state.searchQuery}
          search={this.props.courseSearch}
          results={this.props.searchResults}
          resultStamp={this.props.resultStamp}
          stampIncrement={this.props.stampIncrement}
          setDraggingFulfilledStatus={this.props.setDraggingFulfilledStatus}
          currTerm={this.props.currTerm}
          showDialog={this.props.showDialog}
        />
        <RequirementsPane
          active={this.props.openPane === paneTypes.REQUIREMENTS}
          activate={() => this.handlePaneSwitch(paneTypes.REQUIREMENTS)}
          majors={this.props.user.majors}
          showDeclareDialog={this.showDeclareDialog}
          // distribs={props.planCourses.map(c => c.course.distrib)}
          // wcs={props.planCourses.map(c => c.course.wc)}
          userCourses={this.props.planCourses}
        />
        <BookmarksPane
          active={this.props.openPane === paneTypes.BOOKMARKS}
          activate={() => this.handlePaneSwitch(paneTypes.BOOKMARKS)}
          bookmarks={this.props.user.favorite_courses}
          addToBookmarks={this.addToBookmarks}
          setDraggingFulfilledStatus={this.props.setDraggingFulfilledStatus}
          currTerm={this.props.currTerm}
        />
      </div>
    );
  }
}

// const Sidebar = (props) => {
//   console.log(props.openPane ? props.openPane : paneTypes.REQUIREMENTS);
//   const [activePane, setActivePane] = useState(props.openPane ? props.openPane : paneTypes.REQUIREMENTS); // paneTypes.REQUIREMENTS
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     props.fetchUser();
//     console.log('updated sidebar');
//   }, []);

//   const addToBookmarks = (courseId) => {
//     props.addCourseToFavorites(courseId);
//   };

//   const showDeclareDialog = () => {
//     const opts = {
//       title: 'Declare New Major',
//       okText: 'Enroll',
//       onOk: (majorID) => {
//         props.declareMajor(majorID);
//         setTimeout(() => props.fetchUser(), 100);
//       },
//     };
//     props.showDialog(DialogTypes.DECLARE_MAJOR, opts);
//   };

//   const handlePaneSwitch = (type) => {
//     console.log(type);
//     if (type !== paneTypes.SEARCH) {
//       setSearchQuery('');
//       setActivePane(type);
//     } else {
//       setActivePane(type);
//     }
//   };

//   return (
//     <div className="sidebar">
//       <SearchPane
//         active={activePane === paneTypes.SEARCH}
//         activate={() => handlePaneSwitch(paneTypes.SEARCH)}
//         setSearchQuery={setSearchQuery}
//         searchQuery={searchQuery}
//         search={props.courseSearch}
//         results={props.searchResults}
//         resultStamp={props.resultStamp}
//         stampIncrement={props.stampIncrement}
//         setDraggingFulfilledStatus={props.setDraggingFulfilledStatus}
//         currTerm={props.currTerm}
//         showDialog={props.showDialog}
//       />
//       <RequirementsPane
//         active={activePane === paneTypes.REQUIREMENTS}
//         activate={() => handlePaneSwitch(paneTypes.REQUIREMENTS)}
//         majors={props.user.majors}
//         showDeclareDialog={showDeclareDialog}
//         // distribs={props.planCourses.map(c => c.course.distrib)}
//         // wcs={props.planCourses.map(c => c.course.wc)}
//         userCourses={props.planCourses}
//       />
//       <BookmarksPane
//         active={activePane === paneTypes.BOOKMARKS}
//         activate={() => handlePaneSwitch(paneTypes.BOOKMARKS)}
//         bookmarks={props.user.favorite_courses}
//         addToBookmarks={addToBookmarks}
//         setDraggingFulfilledStatus={props.setDraggingFulfilledStatus}
//         currTerm={props.currTerm}
//       />
//     </div>
//   );
// };


const mapStateToProps = state => ({
  bookmarks: state.courses.bookmarks,
  searchResults: state.courses.results,
  resultStamp: state.courses.resultStamp,
  user: state.user.current,
  currTerm: state.time.currTerm,
});

export default connect(mapStateToProps, {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor,
})(Sidebar);
