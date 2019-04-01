import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import {
  Button, Pane, Dialog, Text,
} from 'evergreen-ui';
import { withRouter } from 'react-router-dom';
import {
  deletePlan, fetchPlan, fetchBucket, updateTerm,
} from '../actions';
import Bucket from '../components/bucket/bucket';
import Term from '../components/term';
import '../style/dplan.css';

class DPlan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDialog: false,
    };

    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.addCourseToTerm = this.addCourseToTerm.bind(this);
  }

  componentDidMount() {
    this.props.fetchPlan(this.props.match.params.id);
    this.props.fetchBucket();
  }

  onDialogSubmit() {
    this.props.deletePlan(this.props.plan.id, this.props.history);
  }

  addCourseToTerm(course, term) {
    term.courses = term.courses.filter(c => c.id !== course.id);
    term.courses.push(course);
    this.props.updateTerm(term).then(() => {
      this.props.fetchPlan(this.props.plan.id);
    }).catch((err) => {
      console.log(err);
    });
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

    return (
      <div className="ctx">
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
              <Button
                id="saveButton"
                onClick={this.savePlan}
              >
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
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: '50px',
            marginRight: '50px',
          }}
          >
            <Bucket height="100%" bucket={this.props.bucket} />
            <div id="plan"
              style={{
                flexGrow: 1,
              }}
            >
              {this.props.plan.terms.map((year) => {
                return (
                  <Row style={{ minHeight: '15vh' }} key={year[0].id}>
                    {year.map((term) => {
                      return (
                        <Col xs="3" className="px-0" key={term.id}>
                          <Term term={term} addCourseToTerm={this.addCourseToTerm} />
                        </Col>
                      );
                    })}
                  </Row>
                );
              })}
            </div>
          </div>
        </Pane>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  plan: state.plans.current,
  bucket: state.courses.bucket,
});

export default withRouter(connect(mapStateToProps, {
  fetchPlan, deletePlan, fetchBucket, updateTerm,
})(DPlan));
