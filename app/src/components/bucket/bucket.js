import React from 'react';
import {
  Card, Fade,
} from 'reactstrap';
import { Icon } from 'evergreen-ui';
import DraggableCourse from '../draggableCourse/draggableCourse';
import './bucket.css';

let anim = false;

export default class Bucket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      width: '30px',
      height: props.height,
    };
    this.toggle = this.toggle.bind(this);
  }

  bucketAnimation() {
    if (anim) {
      if ((this.state.collapse === true)
        && (parseInt(this.state.width, 10) < 240)) {
        this.setState({ width: '240px' });
      } else if ((this.state.collapse !== true)
    && (parseInt(this.state.width, 10) > 30)) {
        this.setState({ width: '30px' });
      } else {
        anim = false;
      }
    }
  }

  toggle() {
    this.setState((prevState) => {
      anim = true;
      return {
        collapse:
        prevState.collapse !== true,
      };
    }, () => {
      this.bucketAnimation();
    });
  }

  fillContent() {
    return (
      <div style={{ width: '100%' }}>
        {this.props.bucket.map((course, index) => {
          return (
            <DraggableCourse key={course.crn}
              index={index}
              course={course}
              inBucket
            />
          );
        })}
      </div>
    );
  }


  render() {
    let content = []; let chevronID = '';
    if (this.state.collapse) {
      content.push(<legend>Bucket</legend>);
      content.push(this.fillContent());
      chevronID = 'chevron-left';
    } else {
      content = <div />;
      chevronID = 'chevron-right';
    }

    return (
      <div>
        <Card className="bucket"
          body
          style={{
            borderColor: '#ECF3FF',
            width: this.state.width,
            height: this.state.height,
          }}
        >
          <Icon id="chevron"
            icon={chevronID}
            onClick={this.toggle}
            size={20}
          />
          <Fade in={this.state.collapse}>
            {content}
          </Fade>
        </Card>
      </div>
    );
  }
}
