import React, { useState } from 'react';
import classNames from 'classnames';
import { DropTarget as BookmarksPane } from 'react-dnd';
import { connect } from 'react-redux';
import { ItemTypes, Departments } from '../../../constants';
import DraggableCourse from '../../../components/draggableCourse';
import { removeCourseFromFavorites } from '../../../actions';

import './bookmarksPane.scss';
import PlaceholderCourse from '../../../components/placeholderCourse';

const target = {
  drop: (props, monitor) => {
    const item = monitor.getItem();

    props.addToBookmarks(item.course.id);
  },
};

const collect = (conn, monitor) => {
  return {
    connectDropTarget: conn.dropTarget(),
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

  const [placeholderDept, setPlaceholderDept] = useState('COSC');

  return props.connectDropTarget(
    <div className={paneClass} onClick={props.activate} role="presentation">
      <div className="pane-header">
        <h1 className="pane-title">Bookmarked</h1>
      </div>
      {props.active
        ? (
          <div className="bookmarked-courses-list">
            <div className="row">
              <select defaultValue={placeholderDept} className="sort-picker" onChange={e => setPlaceholderDept(e.target.value)}>
                {Departments.map((d, i) => <option key={i.toString()} value={d}>{d}</option>)}
              </select>
              <PlaceholderCourse size="sm" department={placeholderDept} addPlaceholderCourse={props.addPlaceholderCourse} />
            </div>
            {props.bookmarks.map((course, index) => {
              return (
                <div key={course.id}>
                  <div className="paneCourse">
                    <DraggableCourse course={course} currTerm={props.currTerm} setDraggingFulfilledStatus={props.setDraggingFulfilledStatus} showIcon icon="close" onIconClick={() => props.removeCourseFromFavorites(course._id)} />
                  </div>
                  <div id="course-spacer-large" />
                </div>
              );
            })}
          </div>
        ) : null
          }
    </div>,
  );
};

// eslint-disable-next-line new-cap
export default BookmarksPane(ItemTypes.COURSE, target, collect)(connect(null, { removeCourseFromFavorites })(component));
