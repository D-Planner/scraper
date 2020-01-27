import { TimelineMax as Timeline, Power1 } from 'gsap';

export const ROUTE_LOOKUP = {
  home: { // Needs authentication
    routeFull: '/',
    routeKey: '',
    loadAnimation: (node, delay, authenticated) => (authenticated === true ? getDPlanLoadTimeline(node, delay) : getHomeLoadTimeline(node, delay)),
    exitAnimation: (node, authenticated) => (authenticated === true ? getDPlanExitTimeline(node) : getHomeExitTimeline(node)), // Change this
  },
  course: {
    routeFull: '/course/:id',
    routeKey: 'course',
    // loadAnimation: () => {},
    // exitAnimation: () => {},
  },
  professor: {
    routeFull: '/professors/:id',
    routeKey: 'professors',
    // loadAnimation: () => {},
    // exitAnimation: () => {},
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
    // loadAnimation: () => {},
    // exitAnimation: () => {},
  },
  verifyEmail: {
    routeFull: '/email/:key',
    routeKey: 'email',
    // loadAnimation: () => {},
    // exitAnimation: () => {},
  },
  resetPassword: {
    routeFull: '/pass/:key',
    routeKey: 'pass',
    // loadAnimation: () => {},
    // exitAnimation: () => {},
  },
  forgotPassword: {
    routeFull: '/reset/pass',
    routeKey: 'reset',
    // loadAnimation: () => {},
    // exitAnimation: () => {},
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
    // loadAnimation: () => {},
    // exitAnimation: () => {},
  },
  privacyPolicy: {
    routeFull: '/policies/privacypolicy',
    routeKey: 'privacypolicy',
    // loadAnimation: () => {},
    // exitAnimation: () => {},
  },
  // LATER
  fallback: {
    // loadAnimation: () => {},
    // exitAnimation: () => {},
  },
  default: {
    loadAnimation: (node, delay) => getDefaultLoadTimeline(node, delay),
    exitAnimation: node => getDefaultExitTimeline(node),
  },
};

export const play = (pathname, node, appears, authenticated) => {
  const delay = appears ? 0 : 0.5;
  let route, timeline;

  // const pathnameSplit = pathname.split('/').shift();
  const pathnameSplit = pathname.split('/');
  pathnameSplit.shift();
  // console.log('pathname split in', pathnameSplit);

  // Object.entries(ROUTE_LOOKUP).some(([k, v]) => {
  //   return pathnameSplit.some((option) => {
  //     console.log('routeTest in', v.routeKey, option);
  //     if (v.routeKey === option) {
  //       console.log('k in -', k);
  //       route = v;
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  // });

  // console.log('found route load', route || ROUTE_LOOKUP.default);
  // // const timeline = route.loadAnimation(node, delay, authenticated);
  // const timeline = route.loadAnimation(node, delay, authenticated) || ROUTE_LOOKUP.default.loadAnimation(node, delay, authenticated);
  // console.log('timeline in', timeline);

  // Home page
  if (pathnameSplit[0] === '') {
    timeline = ROUTE_LOOKUP.home.loadAnimation(node, delay, authenticated);
  } else {
    timeline = ROUTE_LOOKUP.default.loadAnimation(node, delay, authenticated);
  }

  window
    .loadPromise
    .then(() => {
      requestAnimationFrame(() => {
        timeline.play();
      });
    });
};

export const exit = (pathname, node, appears, authenticated) => {
  // console.log('EXIT', pathname, node, appears, authenticated);
  let timeline;

  // const pathnameSplit = pathname.split('/').shift();
  const pathnameSplit = pathname.split('/');
  pathnameSplit.shift();
  // console.log('pathname split out', pathnameSplit);

  // let route;
  // Object.entries(ROUTE_LOOKUP).some(([k, v]) => {
  //   return pathnameSplit.some((option) => {
  //     console.log('routeTest out', v.routeKey, option);
  //     if (v.routeKey === option) {
  //       console.log('k out -', k);
  //       route = v;
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  // });

  // console.log('found route exit', route || ROUTE_LOOKUP.default);
  // const timeline = route.exitAnimation(node, authenticated) || ROUTE_LOOKUP.default.exitAnimation(node, authenticated);
  // console.log('timeline out', timeline);

  if (pathnameSplit[0] === '') {
    timeline = ROUTE_LOOKUP.home.exitAnimation(node, authenticated);
  } else {
    timeline = ROUTE_LOOKUP.default.exitAnimation(node, authenticated);
  }

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
  const timeline = new Timeline({ paused: true });

  timeline
    .to(node, 0.3, { opacity: 0, ease: Power1.easeOut });

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

  timeline
    .to(node, 5, { display: 'none', opacity: 0, ease: Power1.easeOut });

  return timeline;
};
