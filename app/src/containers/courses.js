import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Badge,
} from 'reactstrap';
import { fetchCourses } from '../actions';

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
      this.props.allCourses.map((course) => {
        return (
          <ListGroupItem>
            <ListGroupItemHeading>
              {course.title}
              {' '}
              <Badge color="secondary">
                {course.subject}
                {course.number}
              </Badge>
            </ListGroupItemHeading>
            <ListGroupItemText>
              <ul>
                <li>
                  <small>Term code: </small>
                  <small>{course.term}</small>
                </li>
                <li>
                  <small>CRN: </small>
                  <small>{course.crn}</small>
                </li>
                <li>
                  <small>Section: </small>
                  <small>{course.section}</small>
                </li>
                <li>
                  <small>Xlist: </small>
                  {course.xlist.length > 0 ? <small>{course.xlist}</small> : <small>N/A</small>}
                </li>
                <li>
                  <small>WC: </small>
                  <small>{course.wc}</small>
                </li>
                <li>
                  <small>Distrib: </small>
                  <small>{course.distrib}</small>
                </li>
                <li>
                  <small>Building: </small>
                  <small>{course.building}</small>
                </li>
                <li>
                  <small>Room: </small>
                  <small>{course.room}</small>
                </li>
                <li>
                  <small>Period: </small>
                  <small>{course.period}</small>
                </li>
                <li>
                  <small>Instructor: </small>
                  <small>{course.instructor}</small>
                </li>
                <li>
                  <small>Enrollment limit: </small>
                  <small>{course.enrollment_limit}</small>
                </li>
                <li>
                  <small>Current enrollment: </small>
                  <small>{course.current_enrollment}</small>
                </li>
                <li>
                  <small>Status: </small>
                  <small>{course.status}</small>
                </li>
                <li>
                  <small>Links: </small>
                  <Badge color="primary" href={course.description}>Description</Badge>
                  {' '}
                  <Badge color="primary" href={course.text}>Textbook information</Badge>
                  {' '}
                  {course.learning_objective.length > 0 && <Badge color="primary" href={course.learning_objective}>Learning objective</Badge>}
                </li>
              </ul>
            </ListGroupItemText>
          </ListGroupItem>
        );
      })
    );
  }

  render() {
    return (
      <ListGroup>
        {this.renderCourses()}
      </ListGroup>
    );
  }
}

const mapStateToProps = state => ({
  allCourses: state.courses.all,
});

export default withRouter(connect(mapStateToProps, { fetchCourses })(Courses));
