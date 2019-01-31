import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import Flowchart from './flowchart';
import Nav from '../containers/Nav';
import signUp from '../containers/signUp';
import signIn from '../containers/signIn';
import Courses from '../containers/courses';
import requireAuth from '../containers/requireAuth';
import DPlan from '../containers/dplan';

const FallBack = (props) => {
  return <div> URL Not Found </div>;
};


const App = (props) => {
  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          <Route exact path="/" component={requireAuth(Flowchart)} />
          <Route exact path="/courses" component={requireAuth(Courses)} />
          <Route path="/signup" component={signUp} />
          <Route path="/signin" component={signIn} />
          <Route path="/plan" component={DPlan} />
          <Route component={FallBack} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
