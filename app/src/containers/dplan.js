import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import Term from '../components/term';

import './dplan.scss';

class DPlan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      plan: null,
    };
  }

  componentDidMount() {
    if (this.props.location.state.empty) {
      this.setState((state, props) => ({ plan: props.location.state.empty }));
    }
  }

  render() {
    console.log(this.state.plan);
    if (!this.state.plan) {
      return (<div />);
    }

    const containerClass = classNames({
      ctnr: true,
    });
    return (
      <div className={containerClass}>
        <Container>
          {this.state.plan.plan.map((year) => {
            console.log(year);
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

export default withRouter(DPlan);
