import { TimelineMax as Timeline, Power1 } from 'gsap';

export const ROUTE_LOOKUP = {
  // LATER
  home: { // Needs authentication
    routeFull: '/',
    routeKey: '',
    // Authenticated becomes true before animation can load
    loadAnimation: (node, delay, authenticated) => (authenticated === true ? getDPlanLoadTimeline(node, delay) : getHomeLoadTimeline(node, delay)),
    exitAnimation: (node, authenticated) => (authenticated === true ? getDPlanExitTimeline(node) : getHomeExitTimeline(node)), // Change this
  },
  course: {
    routeFull: '/course/:id',
    routeKey: 'course',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  professor: {
    routeFull: '/professors/:id',
    routeKey: 'professors',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  // discover: {
  //   routeFull: '/discover',
  //   routeKey: 'discover',
  //   loadAnimation: () => {},
  //   exitAnimation: () => {},
  // },
  credits: {
    routeFull: '/credits',
    routeKey: 'credits',
    // CHANGE THESE
    loadAnimation: (node, delay) => getDefaultLoadTimeline(node, delay),
    exitAnimation: node => getDefaultExitTimeline(node),
  },
  verifyEmail: {
    routeFull: '/email/:key',
    routeKey: 'email',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  resetPassword: {
    routeFull: '/pass/:key',
    routeKey: 'pass',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  forgotPassword: {
    routeFull: '/reset/pass',
    routeKey: 'reset',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  tutorial: { // Needs authentication
    routeFull: '/tutorial/:page',
    routeKey: 'tutorial',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  termsAndConditions: {
    routeFull: '/policies/termsandconditions',
    routeKey: 'termsancconditions',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  privacyPolicy: {
    routeFull: '/policies/privacypolicy',
    routeKey: 'privacypolicy',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  // LATER
  fallback: {
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  default: {
    loadAnimation: (node, delay) => getDefaultLoadTimeline(node, delay),
    exitAnimation: node => getDefaultExitTimeline(node),
  },
};

export const play = (pathname, node, appears, authenticated) => {
  const delay = appears ? 0 : 0.5;
  let route;

  const pathnameSplit = pathname.split('/');

  Object.entries(ROUTE_LOOKUP).some(([k, v]) => {
    return pathnameSplit.some((option) => {
      console.log('routeTest', v.routeKey, option);
      if (v.routeKey === option) {
        route = v;
        return true;
      } else {
        return false;
      }
    });
  });

  console.log('found route load', route);
  const timeline = route.loadAnimation(node, delay, authenticated);

  window
    .loadPromise
    .then(() => {
      requestAnimationFrame(() => {
        timeline.play();
      });
    });
};

export const exit = (pathname, node, appears, authenticated) => {
  console.log('EXIT', pathname, node, appears, authenticated);

  const pathnameSplit = pathname.split('/');

  let route;
  Object.entries(ROUTE_LOOKUP).some(([k, v]) => {
    return pathnameSplit.some((option) => {
      console.log('routeTest', v.routeKey, option);
      if (v.routeKey === option) {
        route = v;
        return true;
      } else {
        return false;
      }
    });
  });

  console.log('found route exit', route);
  const timeline = route.exitAnimation(node, authenticated);

  requestAnimationFrame(() => {
    timeline.play();
  });
};

/**
 * Landing page LOAD timeline
 * @param {*} node
 * @param {*} delay
 */
const getHomeLoadTimeline = (node, delay) => {
  const timeline = new Timeline({ paused: true });
  const texts = node.querySelectorAll('span');

  timeline
    .from(node, 0, { display: 'none', autoAlpha: 0, delay })
    .staggerFrom(texts, 0.375, { autoAlpha: 0, x: -25, ease: Power1.easeOut }, 0.125);

  return timeline;
};

/**
 * Landing page EXIT timeline
 * @param {*} node
 */
const getHomeExitTimeline = (node) => {
  console.log('getHomeExitTimeline');
  const timeline = new Timeline({ paused: true });
  const texts = node.querySelectorAll('span');

  timeline
    .to(node, 0, { display: 'none', autoAlpha: 0 })
    .staggerTo(texts, 0.375, { autoAlpha: 0, x: 25, ease: Power1.easeOut }, 0.125);

  return timeline;
};

/**
 * DPlan page LOAD timeline
 * @param {*} node
 * @param {*} delay
 */
const getDPlanLoadTimeline = (node, delay) => {
  console.log('dplan load timeline');
  const timeline = new Timeline({ paused: true });

  timeline
    .from(node, 0.3, { opacity: 0, delay });

  return timeline;
};

/**
 * DPlan page EXIT timeline
 * @param {*} node
 */
const getDPlanExitTimeline = (node) => {
  console.log('getDPlan timeline');
  const timeline = new Timeline({ paused: true });

  timeline
    .to(node, 0.3, { opacity: 0, ease: Power1.easeOut });

  console.log('dplanExitTimeline', timeline);
  console.log('node', node);

  return timeline;
};

/**
 * Default LOAD timeline
 * @param {*} node
 * @param {*} delay
 */
const getDefaultLoadTimeline = (node, delay) => {
  const timeline = new Timeline({ paused: true });
  const content = node.querySelector('span');

  timeline
    .from(node, 0.3, {
      display: 'none', opacity: 0, delay, ease: Power1.easeIn,
    })
    .from(content, 0.15, { autoAlpha: 0, y: 25, ease: Power1.easeInOut });

  return timeline;
};

/**
 * Default EXIT timeline
 * @param {*} node
 */
const getDefaultExitTimeline = (node) => {
  const timeline = new Timeline({ paused: true });

  console.log('defaultExit', node, timeline);

  timeline
    .to(node, 5, { display: 'none', opacity: 0, ease: Power1.easeOut });

  return timeline;
};
