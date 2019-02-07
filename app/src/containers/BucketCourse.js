import React from 'react';
import {
  Button,
} from 'reactstrap';
import { Icon } from 'evergreen-ui';
import '../bucket.css';
// import DragSource from './dragNdrop';

export default class BucketCourse extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
    this.state = {
      index: this.props.index[0],
      dragging: this.props.dragging,
      displayText: this.props.displayText,
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

  render() {
    return (
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
