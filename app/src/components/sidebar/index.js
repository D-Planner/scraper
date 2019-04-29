import React, { Component } from 'react';
import DraggableCourse from '../draggableCourse';
import SearchPane from './searchPane';
import RequirementsPane from './requirementsPane';
import './sidebar.scss';

const paneTypes = {
  SEARCH: 'SEARCH',
  REQUIREMENTS: 'REQUIREMENTS',
  BOOKMARKS: 'BOOKMARKS',
};

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePane: paneTypes.REQUIREMENTS,
    };
  }

  setActivePane(paneType) {
    this.setState({
      activePane: paneType,
    });
  }

  renderSearch() {
    if (this.state.activePane === paneTypes.SEARCH) {
      return <SearchPane />;
    } else {
      return (
        <div className="search pane collapsed">
          <h1>Search</h1>
        </div>
      );
    }
  }

  renderRequirements() {
    if (this.state.activePane === paneTypes.REQUIREMENTS) {
      return <RequirementsPane />;
    } else {
      return (
        <div className="requirements pane collapsed">
          <h1>Requirements</h1>
        </div>
      );
    }
  }

  renderBookmarks() {
    if (this.state.activePane === paneTypes.BOOKMARKS) {
      return <SearchPane />;
    } else {
      return (
        <div className="bookmarks pane">
          <h1 className="bookmarks-header">Bookmarks</h1>
          <div className="bookmarked-courses-list">
            {this.props.bucket.map((course, index) => {
              return (
                <DraggableCourse
                  key={course.crn}
                  index={index}
                  course={course}
                />
              );
            })}
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="sidebar">
        {this.renderSearch()}
        {this.renderRequirements()}
        {this.renderBookmarks()}
      </div>
    );
  }
}

export default Sidebar;
