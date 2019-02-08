import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { fetchPlan } from '../actions';

import Term from '../components/term';

class DPlan extends Component {
  componentDidMount() {
    this.props.fetchPlan(this.props.match.params.id);
  }

  render() {
    if (!this.props.plan) {
      return (<div />);
    }

    const ctnrStyle = {
      padding: '16px',
      backgroundColor: '#DD5555',
    };
    return (
      <div style={ctnrStyle}>
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
    );
  }
}

const mapStateToProps = state => ({
  plan: state.plans.current,
});

export default withRouter(connect(mapStateToProps, { fetchPlan })(DPlan));
