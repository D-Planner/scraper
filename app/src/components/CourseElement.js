import React, { Component } from 'react';
import { Icon, Popover, Pane } from 'evergreen-ui';
import '../style/bucket.css';
import {
  Button,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Badge,
} from 'reactstrap';
// import DragSource from './dragNdrop';

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
      <ListGroupItem>
        <ListGroupItemHeading
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {this.props.course.title}
          {' '}
          <Badge color="secondary">
            {this.props.course.department}
            {this.props.course.number}
          </Badge>
          <Icon id="minus_icon" icon="small-minus" />
        </ListGroupItemHeading>
        <ListGroupItemText>
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
              <Badge color="primary" href={this.props.course.description}>Description</Badge>
              {' '}
              <Badge color="primary" href={this.props.course.text}>Textbook information</Badge>
              {' '}
            </li>
          </ul>
        </ListGroupItemText>
      </ListGroupItem>
    );
  }

  render() {
    return (
      <Popover
        content={({ close }) => (
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            {this.courseInfo()}
          </Pane>
        )}
      >
        <Button className="bucketCourse"
          active={!this.state.dragging}
          style={this.state.offTerm ? {
            background: '#FFFFFF',
            width: '80%',
            marginTop: '5px',
            borderColor: '#FFFFFF',
            boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.08)',
          } : {
            background: '#FFFFFF',
            width: '80%',
            marginTop: '5px',
            borderColor: '#FFFFFF',
            boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.25)',
          }
          }
        >
          <Pane id="bucketCourseTitle"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {this.props.course.department}
              {this.props.course.number}
            </div>
            <div>
              {this.props.course.timeslot}
            </div>
          </Pane>
        </Button>
      </Popover>
    );
  }
}
