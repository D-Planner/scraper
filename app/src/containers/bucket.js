import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  TabContent, TabPane, Card, Fade,
} from 'reactstrap';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Icon } from 'evergreen-ui';
import BucketCourse from './BucketCourse';
import { fetchBucket } from '../actions/index';
import '../bucket.css';

let anim = false;
const test = [{
  term: 201901,
  crn: 10452,
  subject: 'AAAS',
  number: 10,
  section: 1,
  cross_list: 'Intro African Amer Studies',
  'text:': 'https://oracle-www.dartmouth.edu/dart/groucho/course_desc.display_non_fys_req_mat?p_term=201901\u0026p_crn=10452',
  xlist: '',
  period: '2A',
  room: '107',
  building: 'Dartmouth Hall',
  instructor: 'Shalene Moodie',
  wc: 'CI',
  distirb: 'SOC',
  enrollment_limit: 25,
  current_enrollment: 5,
  status: 'IP',
  learning_objective: '',
},
{
  term: 201901,
  crn: 10199,
  subject: 'AAAS',
  number: 13,
  section: 1,
  cross_list: 'Black Amer Since Civil War',
  'text:': 'https://oracle-www.dartmouth.edu/dart/groucho/course_desc.display_non_fys_req_mat?p_term=201901\u0026p_crn=10199',
  xlist: 'HIST 017 01',
  period: '2A',
  room: 'First',
  building: 'Cutter/Shabazz',
  instructor: 'Derrick White',
  wc: 'W',
  distirb: 'SOC',
  enrollment_limit: 36,
  current_enrollment: 6,
  status: 'IP',
  learning_objective: '',
},
{
  term: 201901,
  crn: 11679,
  subject: 'AAAS',
  number: 14,
  section: 1,
  cross_list: 'PreColonial African History',
  'text:': 'https://oracle-www.dartmouth.edu/dart/groucho/course_desc.display_non_fys_req_mat?p_term=201901\u0026p_crn=11679',
  xlist: 'HIST 05.01 01',
  period: '12',
  room: 'C214',
  building: 'Carson',
  instructor: 'Jeremy Dell',
  wc: 'NW',
  distirb: 'SOC',
  enrollment_limit: 35,
  current_enrollment: 17,
  status: 'IP',
  learning_objective: '',
}];

class Bucket extends React.Component {
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
    this.props.fetchBucket();
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
    // this.bcRef.current.startDrag();
  }

  fillContent() {
    return (
      test.map((course, index) => {
        return (
          <BucketCourse key={course.crn}
            index={index}
          // onChange={this.courseSelect(index)}
            dragging={(this.state.cSelected.indexOf(index) !== -1).toString()}
          // ref={this.bcRef}
            displayText={`${course.subject}${course.number}`}
          />
        );
      })
    );
  }


  render() {
    let content = []; let chevronID = '';
    if (this.state.collapse) {
      content.push(<legend>Bucket</legend>);
      content.push(this.fillContent());
      chevronID = 'chevron-right';
    } else {
      content = <div />;
      chevronID = 'chevron-left';
    }

    return (
      <div>
        <TabContent activeTab={this.state.activeTab}>
          <DragDropContextProvider backend={HTML5Backend}>
            <TabPane tabId="1"
              className="float-right"
              style={{ paddingRight: '100px' }}
            >
              <Card className="bucket"
                body
                style={{
                  backgroundColor: '#c0c3c6',
                  borderColor: '#c0c3c6',
                  width: this.state.width,
                  height: '500px',
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
  allCourses: state.courses.bucket,
});

export default withRouter(connect(mapStateToProps, { fetchBucket })(Bucket));
