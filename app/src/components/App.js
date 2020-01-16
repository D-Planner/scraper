import React, { Component } from 'react';
import {
  BrowserRouter as Router, Route, Switch, BrowserRouter,
} from 'react-router-dom';
import { TransitionGroup, Transition } from 'react-transition-group';
import { TimelineMax as Timeline, Power1 } from 'gsap';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';
import { setPressedKey, removePressedKey } from '../actions';
import Courses from '../containers/courses';
import Cytoscape from './Cytoscape';
import requireAuth from '../containers/requireAuth';
import Professor from '../containers/professor';
import Landing from './landing';
import FallBack from './fallBack';
import DPlan from '../containers/dplan';
import TooSmall, { minWidth, minHeight } from './tooSmall';
import Credits from './credits';
import ForgotPassword from './forgotPassword';
import VerifyEmail from './verifyEmail';
import ResetPassword from './resetPass';
import PrivacyPolicy from './policies/privacy';
import Tutorial from './tutorial';
import TermsAndConditions from './policies/terms_conditions';
import CoursePage from '../containers/coursePage';


const play = (pathname, node, appears) => {
  const delay = appears ? 0 : 0.5;
  let timeline;

  if (pathname === '/') {
    timeline = getHomeTimeline(node, delay);
  } else {
    timeline = getDefaultTimeline(node, delay);
  }

  timeline.play();
  // window.loadPromise.then(() => requestAnimationFrame(() => timeline.play()));
};

const getHomeTimeline = (node, delay) => {
  const timeline = new Timeline({ paused: true });
  const texts = node.querySelectorAll('span');

  timeline
    .from(node, 0, { display: 'none', autoAlpha: 0, delay })
    .staggerFrom(texts, 0.375, { autoAlpha: 0, x: -25, ease: Power1.easeOut }, 0.125);

  return timeline;
};

const getDefaultTimeline = (node, delay) => {
  const timeline = new Timeline({ paused: true });
  const content = node.querySelector('span');

  timeline
    .from(node, 0.3, {
      display: 'none', autoAlpha: 0, delay, ease: Power1.easeIn,
    })
    .from(content, 0.15, { autoAlpha: 0, y: 25, ease: Power1.easeInOut });

  return timeline;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    window.addEventListener('focus', (e) => {
      // console.log('focus changed - APP');
      // console.log(e.target);
    }, true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    window.removeEventListener('focus', e => console.log(e));
  }

  updateWindowDimensions() {
    console.log(`Detected window resize to w:${window.innerWidth} h:${window.innerHeight}`);
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    const sizeSufficient = process.env.NODE_ENV === 'development' ? true : (this.state.width >= minWidth && this.state.height >= minHeight);
    if (sizeSufficient) {
      return (
        <div>
          <BrowserRouter>
            <Route render={({ location }) => {
              // https://css-tricks.com/animating-between-views-in-react/
              // https://greensock.com/get-started/
              const { pathname, key } = location;
              return (
                <div>
                  <div className="app-container">
                    <TransitionGroup component={null}>
                      <Transition
                        key={key}
                        appear
                        onEnter={(node, appears) => play(pathname, node, appears)}
                        timeout={{ enter: 750, exit: 0 }}
                      >
                        <Switch location={location}>
                          <Route exact path="/" component={requireAuth(Landing, DPlan)} />
                          <Route path="/course/:id" component={CoursePage} />
                          <Route exact path="/courses" component={requireAuth(Courses)} />
                          <Route path="/professors/:id" component={Professor} />
                          <Route path="/discover" component={Cytoscape} />
                          <Route path="/plan/:id" component={DPlan} />
                          <Route path="/credits" component={Credits} />
                          <Route path="/email/:key" component={VerifyEmail} />
                          <Route path="/pass/:key" component={ResetPassword} />
                          <Route path="/reset/pass" component={ForgotPassword} />
                          <Route path="/tutorial/:page" component={requireAuth(Landing, Tutorial)} />
                          <Route path="/policies/termsandconditions" component={TermsAndConditions} />
                          <Route path="/policies/privacypolicy" component={PrivacyPolicy} />
                          <Route component={FallBack} />
                        </Switch>
                      </Transition>
                    </TransitionGroup>
                  </div>
                </div>
              );
            }}
            />
          </BrowserRouter>
        </div>
      );
    } else {
      return (
        <TooSmall />
      );
    }
  }
}

// eslint-disable-next-line new-cap
export default connect(null, { setPressedKey, removePressedKey })(DragDropContext(HTML5Backend)(App));
