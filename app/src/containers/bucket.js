import React from 'react';
import {
  TabContent, TabPane, Card, Row, Col, Fade,
} from 'reactstrap';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Icon } from 'evergreen-ui';
import BucketCourse from './BucketCourse';
import { fetchBucket } from '../actions/index';
import '../bucket.css';

let anim = false;

export default class Bucket extends React.Component {
  constructor(props) {
    super(props);
    this.bcRef = React.createRef();
    this.state = {
      cSelected: [],
      activeTab: '1',
      collapse: false,
      width: '30px',
    };
    this.courseSelect = this.courseSelect.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    fetchBucket();
  }

  bucketAnimation() {
    if (anim) {
      if ((this.state.collapse === true)
        && (parseInt(this.state.width, 10) < 250)) {
        this.setState({ width: '250px' });
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

  courseSelect(selected) {
    this.setState({ cSelected: selected });
    this.bcRef.current.startDrag();
  }

  render() {
    return (
      <div>
        <TabContent activeTab={this.state.activeTab}>
          <DragDropContextProvider backend={HTML5Backend}>
            <TabPane tabId="1"
              className="float-right"
              style={{ paddingRight: '100px' }}
            >
              <Row>
                <Col sm="6">
                  <Card className="bucket"
                    body
                    style={{
                      backgroundColor: '#c0c3c6',
                      borderColor: '#c0c3c6',
                      width: this.state.width,
                      height: '500px',
                    }}
                  >
                    <Icon icon="chevron-left"
                      onClick={this.toggle}
                    />
                    if(
                    {this.state.collapse}
)
                    {
                      <Fade in={this.state.collapse}>
                        <legend>Bucket</legend>
                        <BucketCourse index="1"
                          onChange={this.courseSelect}
                          dragging={(this.state.cSelected.indexOf(1) !== -1).toString()}
                          ref={this.bcRef}
                        />
                      </Fade>
                  }
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </DragDropContextProvider>
        </TabContent>
      </div>
    );
  }
}
