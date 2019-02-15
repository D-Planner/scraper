import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { Button, Pane, Dialog } from 'evergreen-ui';
import { withRouter } from 'react-router-dom';
import { deletePlan, fetchPlan } from '../actions';

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

    const ctnrStyle = {
      padding: '16px',
      backgroundColor: '#DD5555',
    };
    return (
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
    );
  }
}

const mapStateToProps = state => ({
  plan: state.plans.current,
});

export default withRouter(connect(mapStateToProps, { fetchPlan, deletePlan })(DPlan));
