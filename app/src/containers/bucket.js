import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  TabContent, TabPane, Card, Fade,
} from 'reactstrap';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Icon } from 'evergreen-ui';
import BucketCourse from '../components/CourseElement';
import '../style/bucket.css';
<<<<<<< HEAD
import { addToBucket, fetchUser } from '../actions/index';
=======
import { fetchBucket } from '../actions/index';
>>>>>>> master

let anim = false;

class Bucket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cSelected: [],
      activeTab: '1',
      collapse: false,
      width: '30px',
      height: this.props.height,
    };
    this.courseSelect = this.courseSelect.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    this.props.fetchUser();
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

  courseSelect(selected) {
    this.setState({ cSelected: selected });
  }

  fillContent() {
    return (
      <div style={{ width: '240px' }}>
        {this.props.user.favorite_courses.map((course, index) => {
          return (
            <BucketCourse key={course.crn}
              index={index}
              dragging={(this.state.cSelected.indexOf(index) !== -1).toString()}
              displayText={`${course.subject}${course.number}`}
              course={course}
              offTerm
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
        <TabContent activeTab={this.state.activeTab}>
          <DragDropContextProvider backend={HTML5Backend}>
            <TabPane tabId="1"
              className="float-left"
            >
              <Card className="bucket"
                body
                style={{
                  width: this.state.width,
                  height: this.state.height,
                  borderColor: '#ECF3FF',
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
            </TabPane>
          </DragDropContextProvider>
        </TabContent>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.all,
});

<<<<<<< HEAD
export default withRouter(connect(mapStateToProps, { addToBucket, fetchUser })(Bucket));
=======
export default withRouter(connect(mapStateToProps, { fetchBucket })(Bucket));
>>>>>>> master
