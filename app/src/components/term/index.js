/* eslint-disable no-shadow */
import React, { Component } from 'react';
import classNames from 'classnames';
import { DropTarget as TermTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DraggableCourse from '../draggableCourse';
import HourSelector from '../hourSelector';
import { DialogTypes, ItemTypes } from '../../constants';
import './term.scss';
import { updateTerm, showDialog, fetchPlan } from '../../actions';

const termTarget = {
  drop: (props, monitor) => {
    const item = monitor.getItem();

    // if a course was dragged from another source term,
    // then delete it from that term and add it to this one
    if (!props.term.off_term) {
      if (item.sourceTerm) {
        props.removeCourseFromTerm(item.course, item.sourceTerm);
      }

      props.addCourseToTerm(item.course, props.term);

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
  constructor(props) {
    super(props);

    // Bindings
    // this.turnOffTerm = this.turnOffTerm.bind(this);
    this.showDialog = this.showDialog.bind(this);
    // this.showOffTermDialog = this.showOffTermDialog.bind(this);
    this.termClass = this.termClass.bind(this);
    this.onButtonClass = this.onButtonClass.bind(this);
    this.offButtonClass = this.offButtonClass.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.turnOnTerm = this.turnOnTerm.bind(this);
  }


  onButtonClick() {
    console.log('clicked!');
    console.log(this.props.term);
    this.turnOnTerm();
    // console.log(props.term.offterm)
    console.log('result');
    console.log(this.props.term);
  }

  onButtonClass() {
    classNames({
      // 'toggle-button': true,
      active: !this.props.term.off_term,
    });
  }

  offButtonClass() {
    classNames({
      // 'toggle-button': true,
      active: this.props.term.off_term,
    });
  }


  termClass() {
    if (this.props.term.off_term) {
      return 'offterm';
    } else {
      return 'onterm';
    }

    // classNames({
    // term: true,
    // offterm: this.props.term.off_term,
    // });
  }

  // turnOffTerm(term) {
  //   this.props.updateTerm(term).then(() => {
  //     this.props.fetchPlan(this.props.plan.id);
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }

  // showOffTermDialog(term) {
  //   const opts = {
  //     title: 'Turn Term Off',
  //     okText: 'Ok!',
  //     onOk: () => {
  //       this.turnOffTerm(term);
  //     },
  //   };
  //   this.props.showDialog(DialogTypes.OFF_TERM, opts);
  // }

  showDialog() {
    const opts = {
      title: 'Turn Term Off',
      okText: 'Ok!',
      onOk: () => {
        this.props.term.off_term = true;
        this.props.term.courses = [];
        this.props.updateTerm(this.props.term)
          .then(() => {
            this.props.fetchPlan(this.props.plan.id);
          });
        // this.props.deletePlan(this.props.plan.id, this.props.history);
      },
    };
    this.props.showDialog(DialogTypes.DELETE_PLAN, opts);
    // this.props.showDialog(DialogTypes.OFF_TERM, opts);
  }

  turnOnTerm() {
    this.props.term.off_term = false;
    this.props.term.courses = [];
    this.props.updateTerm(this.props.term).then(() => {
      this.props.fetchPlan(this.props.plan.id);
    });
  }

  render() {
    return this.props.connectDropTarget(
      <div className="term">
        <div className={this.termClass}>
          <div className="header">
            <div className="term-name">{this.props.term.name}</div>
            <div className="offterm-buttons">
              <span onClick={this.onButtonClick} role="button" tabIndex={-1} className={this.onButtonClass}>OFF</span>
              <span onClick={this.showDialog} role="button" tabIndex={-1} className={this.offButtonClass}>ON</span>
            </div>
          </div>
          {renderContent(this.props)}
        </div>
      </div>
      ,
    );
  }
}

const renderContent = (props) => {
  if (props.term.courses.length === 0 && !props.term.off_term) {
    return (
      <div className="term-content no-content">
        <p>Drag-n-drop your courses here!</p>
      </div>
    );
  }
  return (
    <div className="term-content">
      {props.term.courses.map((course) => {
        return (
          <div className="course-row">
            <DraggableCourse
              key={course.id}
              course={course}
              sourceTerm={props.term}
              removeCourseFromTerm={() => {
                props.removeCourseFromTerm(course, props.term);
              }}
            />
            <div>
              <HourSelector timeslots={course.timeslot} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

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
  updateTerm, showDialog, fetchPlan,
})(Term)));
