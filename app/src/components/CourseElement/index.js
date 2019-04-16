import React, { Component } from 'react';
import './CourseElement.scss';

export default class CourseElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: this.props.dragging,
      offTerm: this.props.offTerm,
    };

    this.startDrag = this.startDrag.bind(this);
  }

  startDrag() {
    this.setState((prevState) => {
      return { displayText: `${prevState.displayText} dragging!` };
    });
    this.setState((prevState) => {
      return { dragging: true };
    });
    console.log('dragging!!');
  }

  courseInfo() {
    return (
      <div className="list-group-item">
        <div className="list-group-item-heading">
          {this.props.course.title}
          {' '}
          <div className="badge" color="secondary">
            {this.props.course.department}
            {this.props.course.number}
          </div>
          <img id="minus_icon"
            alt="icon"
            src="../../../assets/miscellaneous/test.png"
          />
        </div>
        <div className="list-group-item-text">
          <ul>
            <li>
              <small>Term code: </small>
              <small>{this.props.course.term}</small>
            </li>
            <li>
              <small>CRN: </small>
              <small>{this.props.course.crn}</small>
            </li>
            <li>
              <small>Section: </small>
              <small>{this.props.course.section}</small>
            </li>
            <li>
              <small>Xlist: </small>
              {this.props.course.xlist.length > 0 ? <small>{this.props.course.xlist}</small> : <small>N/A</small>}
            </li>
            <li>
              <small>WC: </small>
              <small>{this.props.course.wc}</small>
            </li>
            <li>
              <small>Distrib: </small>
              <small>{this.props.course.distrib}</small>
            </li>
            <li>
              <small>Building: </small>
              <small>{this.props.course.building}</small>
            </li>
            <li>
              <small>Room: </small>
              <small>{this.props.course.room}</small>
            </li>
            <li>
              <small>Period: </small>
              <small>{this.props.course.timeslot}</small>
            </li>
            <li>
              <small>Instructor: </small>
              <small>{this.props.course.professors}</small>
            </li>
            <li>
              <small>Enrollment limit: </small>
              <small>{this.props.course.enroll_limit}</small>
            </li>
            <li>
              <small>Current enrollment: </small>
              <small>{this.props.course.current_enrollment}</small>
            </li>
            <li>
              <small>Status: </small>
              <small>{this.props.course.status}</small>
            </li>
            <li>
              <small>Links: </small>
              <div className="badge" color="primary" href={this.props.course.description}>Description</div>
              {' '}
              <div className="badge" color="primary" href={this.props.course.text}>Textbook information</div>
              {' '}
            </li>
          </ul>
        </div>
      </div>
    );
  }

  render() {
    const offTermClassName = this.state.offTerm ? 'off-term-true' : 'off-term-false';

    return (
      <div className="popover"
        content={({ close }) => (
          <div className="pane">
            {this.courseInfo()}
          </div>
        )}
      >
        <div className={offTermClassName}>
          <div className="bucketCourse button"
            active={!this.state.dragging}
          >
            <div id="bucketCourseTitle"
              className="pane"
            >
              <div>
                {this.props.course.department}
                {this.props.course.number}
              </div>
              <div>
                {this.props.course.timeslot}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
