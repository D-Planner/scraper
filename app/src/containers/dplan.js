import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { Button, Pane, Dialog } from 'evergreen-ui';
import { withRouter } from 'react-router-dom';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { deletePlan, fetchPlan, fetchBucket } from '../actions';
import Bucket from '../components/bucket';

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
      display: 'flex',
    };
    return (
      <div className="ctx">
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
        <DragDropContextProvider backend={HTML5Backend}>
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
            <Bucket />
          </div>
        </DragDropContextProvider>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  plan: state.plans.current,
  allCourses: state.courses.bucket,
});

export default withRouter(connect(mapStateToProps, { fetchPlan, deletePlan, fetchBucket })(DPlan));
