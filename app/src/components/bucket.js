import React from 'react';
import {
  Card, Fade,
} from 'reactstrap';
import { Icon } from 'evergreen-ui';
// import DraggableCourse from './draggableCourse';
import '../style/bucket.css';
import DraggableCourse from './draggableCourse';

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

export default class Bucket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      width: '30px',
      height: props.height,
      test,
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
      <div style={{ width: '240px' }}>
        {this.state.test.map((course, index) => {
          return (
            <DraggableCourse key={course.crn}
              index={index}
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
