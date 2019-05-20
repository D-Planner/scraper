import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Nav from '../containers/nav';
import signUp from '../containers/signUp';
import signIn from '../containers/signIn';
import Courses from '../containers/courses';
import Dashboard from '../containers/dashboard';
import requireAuth from '../containers/requireAuth';
import DPlan from '../containers/dplan';
import Discover from '../containers/discover';

const FallBack = (props) => {
  return <div> URL Not Found </div>;
};


const App = (props) => {
  return (
    <div>
      <Router>
        <div className="app-container">
          <Nav />
          <Switch>
            <Route exact path="/" component={requireAuth(Dashboard)} />
            <Route exact path="/courses" component={requireAuth(Courses)} />
            <Route path="/signup" component={signUp} />
            <Route path="/signin" component={signIn} />
            <Route path="/discover" component={Discover} />
            <Route path="/plan/:id" component={DPlan} />
            <Route component={FallBack} />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

// eslint-disable-next-line new-cap
export default DragDropContext(HTML5Backend)(App);
