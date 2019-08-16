import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export default function (ErrorComp, SuccessComp) {
  const requireAuth = (props) => {
    // componentWillMount() {
    //   if (!this.props.authenticated) {
    //     this.props.history.push('/signup');
    //   }
    // }

    // componentWillUpdate(nextProps) {
    //   if (!nextProps.authenticated) {
    //     this.props.history.push('/signup');
    //   }
    // }

    return (props.authenticated)
      ? <SuccessComp {...props} />
      : <ErrorComp {...props} />;
  };

  const mapStateToProps = state => ({
    authenticated: state.auth.authenticated,
  });

  return withRouter(connect(mapStateToProps, null)(requireAuth));
}
