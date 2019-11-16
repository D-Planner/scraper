import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { headlessSignIn, fetchUser } from '../actions';

/**
 * A function to log in a user with a token logged to a URL parameter
 * @param {*} url
 */

// TODO: FIGURE OUT HOW TO REMOVE THIS FROM THE URL
export default function (url) {
  const setAuth = (props) => {
    // Get token from URL parameter
    const token = props.match.params.id.split('||').join('.');
    localStorage.setItem('token', token);

    // Get user with token
    props.fetchUser().then(() => {
      if (props.user) {
        // Sign in with only sending token and user
        props.headlessSignIn(props.user, props.history).then(() => {
          // Redirect to appropriate location
          props.history.push(url);
          return <div>Authorizing...</div>;
        }).catch((error) => {
          console.error(error);
          return <div>Auth error...</div>;
        });
      }
    }).catch((error) => {
      console.error(error);
    });
    return null;
  };

  const mapStateToProps = state => ({
    user: state.user.current,
  });

  return withRouter(connect(mapStateToProps, { headlessSignIn, fetchUser })(setAuth));
}
