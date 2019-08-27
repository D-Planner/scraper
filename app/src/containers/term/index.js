/* eslint-disable no-shadow */
import React, { Component } from 'react';
import classNames from 'classnames';
import { DropTarget as TermTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import HourSelector from '../hourSelector';
import { DialogTypes, ItemTypes } from '../../constants';
import DraggableUserCourse from '../../components/draggableUserCourse';

import './term.scss';
import {
  updateTerm, showDialog, fetchPlan, fetchUser, updateUserCourse, removeCourseFromFavorites,
} from '../../actions';

const termTarget = {
  drop: (props, monitor) => {
    const item = monitor.getItem();
    // if a course was dragged from another source term,
    // then delete it from that term and add it to this one
    if (!props.term.off_term) {
      if (item.sourceTerm && item.sourceTerm.id === props.term.id) {
        return undefined;
      } else if (item.sourceTerm) {
        // console.log('[TERM.js] We think this is a term-to-term drag');
        // this is a UserCourse, so deal with it accordingly
        props.removeCourseFromTerm(item.userCourse, item.sourceTerm).then(() => {
          // console.log(`[TERM.js] The course \n${item.catalogCourse.name} has been removed from \n${item.sourceTerm}`);
          return props.addCourseToTerm(item.catalogCourse, props.term);
        }).then(() => {
          // console.log(`[TERM.js] The course \n${item.catalogCourse.name} has been added to term \n${props.term.id}`);
        });
      } else {
        // console.log('[TERM.js] We think this is a search-to-term drag');
        // this is a regular course, so deal with it accordingly
        props.addCourseToTerm(item.course, props.term).then(() => {
          // console.log(`[TERM.js] The course \n${item.course.name} has been added to term \n${props.term.id}`);
        });
      }
      // return an object containing the current term
      return { destinationTerm: props.term };
    }

    return undefined;
  },
};

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
  };
};

class Term extends Component {
  turnOffTerm = () => {
    const opts = {
      title: 'Turn term off',
      okText: 'Turn Off',
      onOk: () => {
        this.props.term.courses.forEach((course) => {
          // console.log(`Because you are turning off this term, deleting: ${course}`);
          this.props.removeCourseFromFavorites(course.course.id);
          // Not sure if this needs to be made into a Promise.all() ??
          this.props.removeCourseFromTerm(course, this.props.term);
        });
        this.props.term.off_term = true;
        this.props.term.courses = [];
        this.props.updateTerm(this.props.term)
          .then(() => {
            this.props.fetchPlan(this.props.plan.id);
            this.props.fetchUser();
          });
      },
    };
    this.props.showDialog(DialogTypes.OFF_TERM, opts);
  }

  turnOnTerm = () => {
    this.props.term.off_term = false;
    this.props.term.courses = [];
    this.props.updateTerm(this.props.term).then(() => {
      this.props.fetchPlan(this.props.plan.id);
    });
  }

  renderToggleButton = () => {
    if (this.props.term.off_term) {
      return (<span onClick={this.turnOnTerm} role="button" tabIndex={-1} className={classNames({ on: !this.props.term.off_term, off: this.props.term.off_term, 'toggle-button': true })}>OFF</span>
      );
    } else {
      return (<span onClick={this.turnOffTerm} role="button" tabIndex={-1} className={classNames({ on: !this.props.term.off_term, off: this.props.term.off_term, 'toggle-button': true })}>ON</span>
      );
    }
  };

  past = () => {
    const terms = ['W', 'S', 'X', 'F'];
    const [thisYear, thisTerm] = [this.props.term.name.match(/\d{2}/)[0], terms.indexOf(this.props.term.quarter)];
    if (thisYear < this.props.time.currTerm.year) return true;
    if (thisYear > this.props.time.currTerm.year) return false;
    if (thisTerm < terms.indexOf(this.props.time.currTerm.term)) return true;
    return false;
  }

  fourCourses = () => {
    if (this.props.isDragging) {
      return (this.props.term.courses.length === 3 || this.props.term.courses.length === 4);
    } else {
      return (this.props.term.courses.length === 4);
    }
  }

  isCurrTerm = () => {
    const [year, term] = [Number(this.props.term.name.match(/\d{2}/)[0]), this.props.term.quarter];
    if (year === this.props.time.currTerm.year && term === this.props.time.currTerm.term) return true;
    return false;
  }

  isNextTerm = () => {
    const [year, term] = [Number(this.props.term.name.match(/\d{2}/)[0]), this.props.term.quarter];
    if (year === this.props.time.nextTerm.year && term === this.props.time.nextTerm.term) return true;
    return false;
  }

  checkHourError = () => {
    const hours = this.props.term.courses.map((c) => {
      return c.timeslot;
    });
    const uniqueHours = new Set(hours);
    return hours.length !== uniqueHours.size;
  }

  updateUserCourse = (courseID, change) => {
    this.props.updateUserCourse(courseID, change).then((r) => {
      this.props.fetchPlan(this.props.plan.id).then(() => {
      });
    });
  }

  renderIfDragging = () => {
    if (this.props.drag.isDragging && this.props.term.courses.length < 4) {
      const unlikely = (this.props.drag.dragCourse.likely_terms && this.props.drag.dragCourse.likely_terms.length) ? !this.props.drag.dragCourse.likely_terms.includes(this.props.term.quarter) : false;
      const dragStatus = this.props.drag.fulfilledStatus[this.props.term.index];
      const currentTermOfferedError = !this.props.drag.dragCourse.offered && this.isCurrTerm();
      return (
        <div className="course-row">
          <div className={classNames({
            'phantom-course': true,
            [dragStatus]: true,
            unlikely,
            likely: !unlikely,
            error: currentTermOfferedError,
          })}
          >
            {dragStatus === 'error' ? 'Prereq Missing' : ''}
            {dragStatus === 'warning' ? 'Warning, Check Prereqs' : ''}
            {unlikely ? 'This course is unlikely to be offered this term' : 'Likely in this term'}
            {currentTermOfferedError ? 'Not offered this term' : ''}
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  }

  renderContent = () => {
    if (this.props.term.off_term) {
      return (
        <div className={classNames({
          on: !this.props.term.off_term,
          off: this.props.term.off_term,
          'term-content': true,
          'no-content': true,
          past: this.past(),
        })}
        >
          off-term
        </div>
      );
    } else if (this.props.term.courses.length === 0) {
      return (
        <div className={classNames({
          on: !this.props.term.off_term,
          off: this.props.term.off_term,
          'term-content': true,
          'no-content': true,
          past: this.past(),
        })}
        >
          {this.renderIfDragging()}
          {/* {this.past() ? 'Place Your Previous Courses here' : 'Drag-n-drop your courses here!'} */}
        </div>
      );
    }
    return (
      <div className="term-content">
        {this.props.term.courses.map((course) => {
          // console.log(`The course: \n ${course.course.name} \n is in term: \n ${this.props.term.id}`);
          return (
            <div className="course-row-with-space" key={course.id}>
              <div className="course-row">
                <DraggableUserCourse
                  size={(this.isNextTerm() ? 'sm' : 'bg')}
                  key={course.id}
                  catalogCourse={course.course}
                  course={course}
                  sourceTerm={this.props.term.id}
                  removeCourseFromTerm={() => {
                    this.props.removeCourseFromTerm(course, this.props.term);
                  }}
                  setDraggingFulfilledStatus={this.props.setDraggingFulfilledStatus}
                />
                {
                  this.isNextTerm()
                    ? (
                      <div>
                        <HourSelector
                          past={this.past()}
                          key={course.id}
                          course={course}
                          timeslots={course.course.periods}
                          updateUserCourse={this.updateUserCourse}
                        />
                      </div>
                    )
                    : <></>
                }
              </div>
              <div id="course-spacer-small" />
            </div>
          );
        })}
        {this.renderIfDragging()}
      </div>
    );
  };

  render() {
    return this.props.connectDropTarget(
      <div className={classNames({
        on: !this.props.term.off_term,
        off: this.props.term.off_term,
        term: true,
        past: this.past(),
        fourCourses: this.fourCourses(),
      })}
      >
        <div className="header">
          <div className={classNames({
            on: !this.props.term.off_term,
            off: this.props.term.off_term,
            past: this.past(),
            'term-name': true,
          })}
          >
            {/* Add a warning if two courses occupy the same timeslot */}
            {this.props.term.name} {this.props.term.index}
          </div>
          <div className="toggle-buttons">
            {this.renderToggleButton()}
          </div>
        </div>
        {this.renderContent()}
        <div className="accent" />
      </div>
      ,
    );
  }
}

const mapStateToProps = state => ({
  drag: state.dragStatus,
});

// export default withRouter(connect(mapStateToProps, {
//   fetchPlan, deletePlan, updateTerm, showDialog,
// })(DPlan));
// eslint-disable-next-line new-cap
// export default TermTarget(ItemTypes.COURSE, termTarget, collect)(Term);
// eslint-disable-next-line new-cap
export default TermTarget(ItemTypes.COURSE, termTarget, collect)(withRouter(connect(mapStateToProps, {
  updateTerm, showDialog, fetchPlan, fetchUser, updateUserCourse, removeCourseFromFavorites,
})(Term)));
