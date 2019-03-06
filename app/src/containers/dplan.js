import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import {
  Button, Pane, Dialog, Text,
} from 'evergreen-ui';
import { withRouter } from 'react-router-dom';
import { deletePlan, fetchPlan } from '../actions';
import '../style/dplan.css';
import Bucket from './bucket';

import Term from '../components/term';

const test = [{
  term: 201901,
  crn: 10452,
  department: 'AAAS',
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
  department: 'AAAS',
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
  department: 'AAAS',
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

class DPlan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDialog: false,
    };

    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.showDialog = this.showDialog.bind(this);
  }

  componentDidMount() {
    this.props.fetchPlan(this.props.match.params.id);
  }

  onDialogSubmit() {
    this.props.deletePlan(this.props.plan.id, this.props.history);
  }

  showDialog() {
    this.setState({
      showDialog: true,
    });
  }

  hideDialog() {
    this.setState({
      showDialog: false,
    });
  }

  render() {
    if (!this.props.plan) {
      return (<div />);
    }

    const paneHeight = '500px';

    return (
      <div>
        <Pane>
          <Pane style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
          >
            <Pane style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}
            >
              <Text id="title">{this.props.plan.name}</Text>
              <Button id="saveButton">
                <p>
      Save
                </p>
              </Button>
            </Pane>
            <Dialog
              isShown={this.state.showDialog}
              title="Delete Plan?"
              onConfirm={this.onDialogSubmit}
              onCancel={this.hideDialog}
              confirmLabel="Delete"
              intent="danger"
            />
            <Button id="deleteButton" intent="danger" onClick={this.showDialog}>Delete Plan</Button>
          </Pane>
          <Pane style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: '0px',
            marginTop: '20px',
            height: '20px',
          }}
          >

            <p>
On-Terms:
            </p>
            <p>
Courses:
            </p>
            <p>
Distributive Requirements:
            </p>
          </Pane>
          <hr style={{ width: '90%' }} />
          <Pane style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: '50px',
            marginRight: '50px',
          }}
            height={paneHeight}
          >
            <Bucket height={paneHeight} />
            <Pane id="planPane"
              height={paneHeight}
              style={{
                width: '100%',
              }}
            >
              {this.props.plan.terms.map((year) => {
                return (
                  <Row>
                    {year.map((term) => {
                      return (
                        <Col className="px-0" key={term.id}>
                          <Term name={term.name} offTerm={term.off_term} courses={test} />
                        </Col>
                      );
                    })}
                  </Row>
                );
              })}
            </Pane>
          </Pane>
        </Pane>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  plan: state.plans.current,
});

export default withRouter(connect(mapStateToProps, { fetchPlan, deletePlan })(DPlan));
