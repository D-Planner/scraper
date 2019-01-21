import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchCourses } from '../actions/index';

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.renderCourses = this.renderCourses.bind(this);
  }

  componentWillMount() {
    this.props.fetchCourses();
  }

  renderCourses() {
    return (
      this.props.allCourses.map((course, i) => {
        return (
          <li>
            {course.term}
            {course.crn}
            {course.subject}
            {course.number}
            {course.section}
            {course.cross_list}
            {course.text}
            {course.xlist}
            {course.period}
            {course.room}
            {course.building}
            {course.instructor}
            {course.wc}
            {course.distrib}
            {course.enrollment_limit}
            {course.current_enrollment}
            {course.status}
            {course.learning_objective}
          </li>
        );
      })
    );
  }

  render() {
    return (
      <ul>
        {this.renderCourses()}
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  allCourses: state.courses.all,
});

export default withRouter(connect(mapStateToProps, { fetchCourses })(Courses));
