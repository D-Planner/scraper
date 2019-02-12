import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import Flowchart from './flowchart';
<<<<<<< HEAD
import Nav from './Nav';
import bucket from '../containers/bucket';
=======
import Nav from '../containers/Nav';
>>>>>>> master
import signUp from '../containers/signUp';
import signIn from '../containers/signIn';
import Courses from '../containers/courses';
import requireAuth from '../containers/requireAuth';
import DPlan from '../containers/dplan';
import Plans from '../containers/plans';

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
<<<<<<< HEAD
          <Route path="/bucket" component={bucket} />
=======
          <Route exact path="/plans" component={Plans} />
          <Route path="/plan/:id" component={DPlan} />
>>>>>>> master
          <Route component={FallBack} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
