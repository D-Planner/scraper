import React from 'react';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import { DropTarget as BookmarksPane } from 'react-dnd';
import { ItemTypes } from '../../../constants';
import DraggableCourse from '../../../components/draggableCourse';

import './bookmarksPane.scss';

const target = {
  drop: (props, monitor) => {
    const item = monitor.getItem();

    props.addToBookmarks(item.course.id);
  },
};

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
  };
};

/**
 * @name BookmarksPane
 * @description contains a list of favorited or bookmarked courses for a specific user
 */
const component = (props) => {
  const paneClass = classNames({
    bookmarks: true,
    pane: true,
    active: props.active,
  });

  return props.connectDropTarget(
    <div className={paneClass} onClick={props.activate} role="presentation">
      <div className="pane-header">
        <h1 className="pane-title">Bookmarked</h1>
      </div>
      {props.active
        ? (
          <div className="bookmarked-courses-list">
            {props.bookmarks.map((course, index) => {
              console.log(course);
              return (
                <>
                  <div className="paneCourse">
                    <DraggableCourse key={course.id} course={course} />
                    <div className={`dot ${course.offered ? 'success' : 'error'}`} style={{ marginLeft: '5px' }} data-tip />
                    <ReactTooltip place="right" type="dark" effect="float">
                      {course.offered ? 'Offered this term' : 'Not offered this term'}
                    </ReactTooltip>
                  </div>
                  <div id="course-spacer-large" />
                </>
              );
            })}
          </div>
        ) : null
          }
    </div>,
  );
};

// eslint-disable-next-line new-cap
export default BookmarksPane(ItemTypes.COURSE, target, collect)(component);
