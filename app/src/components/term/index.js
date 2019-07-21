/* eslint-disable no-shadow */
import React, { Component } from 'react';
import classNames from 'classnames';
import { DropTarget as TermTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import HourSelector from '../../containers/hourSelector';
import { DialogTypes, ItemTypes } from '../../constants';
import DraggableUserCourse from '../draggableUserCourse';

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
        // this is a UserCourse, so deal with it accordingly
        props.removeCourseFromTerm(item.userCourse, item.sourceTerm).then(() => {
          props.addCourseToTerm(item.catalogCourse, props.term).then(() => {
            this.props.fetchPlan(this.props.plan.id);
          });
        });
        // TO-DO: need to make this a promise
      } else {
        // this is a regular course, so deal with it accordingly
        props.addCourseToTerm(item.course, props.term);
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
      title: 'Turn Term Off',
      okText: 'Ok!',
      onOk: () => {
        this.props.term.courses.forEach((course) => {
          console.log(this.props.term.courses);
          this.props.removeCourseFromFavorites(course.course.id);
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

  renderContent = () => {
    if (this.props.term.off_term) {
      return (
        <div className={classNames({
          on: !this.props.term.off_term, off: this.props.term.off_term, 'term-content': true, 'no-content': true,
        })}
        >
          off-term
        </div>
      );
    } else if (this.props.term.courses.length === 0) {
      return (
        <div className={classNames({
          on: !this.props.term.off_term, off: this.props.term.off_term, 'term-content': true, 'no-content': true,
        })}
        >
          Drag-n-drop your courses here!
        </div>
      );
    }
    return (

      <div className="term-content">
        {this.props.term.courses.map((course) => {
          return (
            <div className="course-row" key={course.id}>
              <DraggableUserCourse
                key={course.id}
                catalogCourse={course.course}
                course={course}
                sourceTerm={this.props.term.id}
                removeCourseFromTerm={() => {
                  this.props.removeCourseFromTerm(course, this.props.term);
                }}
              />
              <div>
                <HourSelector
                  key={course.id}
                  course={course}
                  timeslots={course.course.periods}
                  updateUserCourse={this.props.updateUserCourse}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    return this.props.connectDropTarget(
      <div className={classNames({
        on: !this.props.term.off_term,
        off: this.props.term.off_term,
        term: true,
      })}
      >
        <div className="header">
          <div className={classNames({
            on: !this.props.term.off_term,
            off: this.props.term.off_term,
            'term-name': true,
          })}
          >
            {this.props.term.name}
          </div>
          <div className="toggle-buttons">
            {this.renderToggleButton()}
          </div>
        </div>
        {this.renderContent()}
      </div>
      ,
    );
  }
}

const mapStateToProps = state => ({
  plan: state.plans.current,
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
