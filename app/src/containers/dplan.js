import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { Button, Pane, Text } from 'evergreen-ui';
import { fetchPlan } from '../actions';
import '../style/dplan.css';
import Bucket from './bucket';

import Term from '../components/term';

class DPlan extends Component {
  componentDidMount() {
    this.props.fetchPlan(this.props.match.params.id);
  }

  render() {
    if (!this.props.plan) {
      return (<div />);
    }

    return (
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
    );
  }
}

const mapStateToProps = state => ({
  plan: state.plans.current,
});

export default withRouter(connect(mapStateToProps, { fetchPlan })(DPlan));
