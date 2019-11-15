import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { headlessSignIn, fetchUser } from '../actions';

export default function (url) {
  console.log('setAuth');

  const setAuth = (props) => {
    console.log('props', props);

    const token = props.match.params.id.split('||').join('.');
    console.log('token', token);

    localStorage.setItem('token', token);
    console.log('localstorage', localStorage);

    props.fetchUser().then(() => {
      console.log(props.user);
      if (props.user) {
        props.headlessSignIn(props.user, props.history).then(() => {
          props.history.push(url);
          return <div>Authorizing...</div>;
        }).catch((error) => {
          console.log('headlesssignin error', error);
          return <div>Auth error...</div>;
        });
      }
    }).catch((error) => {
      console.error('fetchUser error', error);
    });
    return null;
  };

  const mapStateToProps = state => ({
    user: state.user.current,
  });

  return withRouter(connect(mapStateToProps, { headlessSignIn, fetchUser })(setAuth));
}
