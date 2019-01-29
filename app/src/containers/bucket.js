import React from 'react';
import {
  TabContent, TabPane, Card, Row, Col,
} from 'reactstrap';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import BucketCourse from './BucketCourse';

export default class Bucket extends React.Component {
  constructor(props) {
    super(props);
    this.bcRef = React.createRef();
    this.state = {
      cSelected: [],
      activeTab: '1',
    };
    this.courseSelect = this.courseSelect.bind(this);
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
                  <Card body
                    style={{
                      backgroundColor: '#c0c3c6', borderColor: '#c0c3c6', width: '250px', height: '500px',
                    }}
                  >
                    <legend>Bucket</legend>
                    {/*  <bucketCourse index="1" />
                    <bucketCourse index="2" >
                    */}
                    <BucketCourse index="1"
                      onChange={this.courseSelect}
                      dragging={(this.state.cSelected.indexOf(1) !== -1).toString()}
                      ref={this.bcRef}
                    />

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
