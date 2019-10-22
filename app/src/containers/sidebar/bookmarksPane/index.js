/* eslint-disable new-cap */
import React from 'react';
import classNames from 'classnames';
import { DropTarget as BookmarksPane } from 'react-dnd';
import { connect } from 'react-redux';
import { fetchPlan } from '../../../actions';
import { ItemTypes } from '../../../constants';
import DraggableCourse from '../../../components/draggableCourse';

import './bookmarksPane.scss';

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

  // const courseInPlan = () => {
  //   // TODO
  // };

  return props.connectDropTarget(
    <div className={paneClass} onClick={props.activate} role="presentation">
      <div className="pane-header">
        <h1 className="pane-title">Bookmarked</h1>
      </div>
      {props.active
        ? (
          <div className="bookmarked-courses-list">
            {props.bookmarks.map((course, index) => {
              props.fetchPlan();
              let setActive = true;

              for (let y = 0; y < props.plan.terms.length; y += 1) {
                // console.log('year');
                // console.log(y);
                for (let t = 0; t < props.plan.terms[y].length; t += 1) {
                  // console.log('term');
                  // console.log(t);
                  for (let c = 0; c < props.plan.terms[y][t].courses.length; c += 1) {
                    // console.log('course');
                    // console.log(props.plan.terms[y][t].courses[c].course);
                    // console.log('id');
                    if (course.id === props.plan.terms[y][t].courses[c].course.id) {
                      console.log(course.id);
                      console.log(props.plan.terms[y][t].courses[c].course.id);
                      console.log('identical courses');
                      setActive = false;
                    }
                  }
                }
              }

              return (
                <div key={course.id}>
                  <div className="paneCourse">
                    <DraggableCourse active={setActive} course={course} currTerm={props.currTerm} setDraggingFulfilledStatus={props.setDraggingFulfilledStatus} />
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

const mapStateToProps = state => ({
  plan: state.plans.current,
});

// eslint-disable-next-line new-cap
export default connect(mapStateToProps, {
  fetchPlan,
})(BookmarksPane(ItemTypes.COURSE, target, collect)(component));
