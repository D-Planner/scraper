import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { Button, Pane, Dialog } from 'evergreen-ui';
import { withRouter } from 'react-router-dom';
import { Button, Pane, Text } from 'evergreen-ui';
import { deletePlan, fetchPlan } from '../actions';
import '../style/dplan.css';
import Bucket from './bucket';

import Term from '../components/term';

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

    return (
      <div>
        <Pane>
          <Pane style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginBottom: '10px',
          }}
          >
            <Text id="title">{this.props.plan.name}</Text>
            <Button id="saveButton">
              <p>
      Save
              </p>
            </Button>
          </Pane>
          <Pane style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: '0px',
            marginLeft: '30px',
            marginRight: '30px',
            marginTop: '20px',
            height: '20px',
          }}
          >
            <p>
Assigned Concentrations:
            </p>
            <p>
On-Terms:
            </p>
            <p>
Courses:
            </p>
            <p>
Distributive Requirements:
            </p>
            <p>
PE credits:
            </p>
            <p>
Language Requirement:
            </p>
          </Pane>
          <hr />
          <Pane style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: '90px',
            marginRight: '100px',
          }}
          >
            <Bucket />
            <div style={{ width: '100%' }}>
              <Container>
                {this.props.plan.terms.map((year) => {
                  return (
                    <Row>
                      {year.map((term) => {
                        return (
                          <Col xs="12" md="3" className="px-0" key={term.id}>
                          <Term name={term.name} offTerm={term.off_term} courses={term.courses} />
                        </Col>
                        );
                      })}
                    </Row>
                  );
                })}
              </Container>
            </div>
          </Pane>
        </Pane>

        <div style={ctnrStyle}>
          <Pane>
            <Dialog
              isShown={this.state.showDialog}
              title="Delete Plan?"
              onConfirm={this.onDialogSubmit}
              onCancel={this.hideDialog}
              confirmLabel="Delete"
              intent="danger"
            />
            <Button intent="danger" onClick={this.showDialog}>Delete Plan</Button>
          </Pane>
          <Container>
            {this.props.plan.terms.map((year) => {
              return (
                <Row>
                  {year.map((term) => {
                    return (
                      <Col xs="12" md="3" className="px-0" key={term.id}>
                        <Term name={term.name} offTerm={term.off_term} courses={term.courses} />
                      </Col>
                    );
                  })}
                </Row>
              );
            })}
          </Container>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  plan: state.plans.current,
});

export default withRouter(connect(mapStateToProps, { fetchPlan, deletePlan })(DPlan));
