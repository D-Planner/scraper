import React from 'react';
import { Icon, Popover, Pane } from 'evergreen-ui';
import '../bucket.css';
import {
  Button,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Badge,
} from 'reactstrap';
// import DragSource from './dragNdrop';

export default class BucketCourse extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
    this.state = {
      index: this.props.index[0],
      dragging: this.props.dragging,
      displayText: this.props.displayText,
      course: this.props.course,
    };

    this.startDrag = this.startDrag.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const differentTitle = this.props.displayText
        !== nextProps.displayText;
    const differentDone = this.props.dragging
        !== nextProps.dragging;
    return differentTitle || differentDone;
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
        <ListGroupItemHeading>
          {this.state.course.title}
          {' '}
          <Badge color="secondary">
            {this.state.course.subject}
            {this.state.course.number}
          </Badge>
        </ListGroupItemHeading>
        <ListGroupItemText>
          <ul>
            <li>
              <small>Term code: </small>
              <small>{this.state.course.term}</small>
            </li>
            <li>
              <small>CRN: </small>
              <small>{this.state.course.crn}</small>
            </li>
            <li>
              <small>Section: </small>
              <small>{this.state.course.section}</small>
            </li>
            <li>
              <small>Xlist: </small>
              {this.state.course.xlist.length > 0 ? <small>{this.state.course.xlist}</small> : <small>N/A</small>}
            </li>
            <li>
              <small>WC: </small>
              <small>{this.state.course.wc}</small>
            </li>
            <li>
              <small>Distrib: </small>
              <small>{this.state.course.distrib}</small>
            </li>
            <li>
              <small>Building: </small>
              <small>{this.state.course.building}</small>
            </li>
            <li>
              <small>Room: </small>
              <small>{this.state.course.room}</small>
            </li>
            <li>
              <small>Period: </small>
              <small>{this.state.course.period}</small>
            </li>
            <li>
              <small>Instructor: </small>
              <small>{this.state.course.instructor}</small>
            </li>
            <li>
              <small>Enrollment limit: </small>
              <small>{this.state.course.enrollment_limit}</small>
            </li>
            <li>
              <small>Current enrollment: </small>
              <small>{this.state.course.current_enrollment}</small>
            </li>
            <li>
              <small>Status: </small>
              <small>{this.state.course.status}</small>
            </li>
            <li>
              <small>Links: </small>
              <Badge color="primary" href={this.state.course.description}>Description</Badge>
              {' '}
              <Badge color="primary" href={this.state.course.text}>Textbook information</Badge>
              {' '}
              {this.state.course.learning_objective.length > 0 && <Badge color="primary" href={this.state.course.learning_objective}>Learning objective</Badge>}
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
          onClick={() => this.props.onChange(this.state.index)}
          active={!this.state.dragging}
        >
          <div className="bcText">
            {' '}
            {this.state.displayText}
            {' '}
          </div>
          <Icon className="minus_icon" icon="small-minus" />
        </Button>
      </Popover>
    );
  }
}


// function renderCourseButton(x, y, [knightX, knightY]) {
//   const black = (x + y) % 2 === 1;
//   const isKnightHere = knightX === x && knightY === y
//   const piece = isKnightHere ? <Knight /> : null;
//
//   return (
//     <Square black={black}>
//       {piece}
//     </Square>
//   );
