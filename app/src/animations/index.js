import { TimelineMax as Timeline, Power1 } from 'gsap';

export const ROUTE_LOOKUP = {
  // LATER
  home: { // Needs authentication
    route: '/',
    // Authenticated becomes true before animation can load
    loadAnimation: (node, delay, authenticated) => (authenticated === true ? getDPlanLoadTimeline(node, delay) : getHomeLoadTimeline(node, delay)),
    exitAnimation: (node, authenticated) => (authenticated === true ? getDPlanExitTimeline(node) : getHomeExitTimeline(node)), // Change this
  },
  course: {
    route: '/course/:id',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  professor: {
    route: '/professors/:id',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  // discover: {
  //   route: '/discover',
  //   loadAnimation: () => {},
  //   exitAnimation: () => {},
  // },
  credits: {
    route: '/credits',
    // CHANGE THESE
    loadAnimation: (node, delay) => getDefaultLoadTimeline(node, delay),
    exitAnimation: node => getDefaultExitTimeline(node),
  },
  verifyEmail: {
    route: '/email/:key',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  resetPassword: {
    route: '/pass/:key',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  forgotPassword: {
    route: '/reset/pass',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  tutorial: { // Needs authentication
    route: '/tutorial/:page',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  termsAndConditions: {
    route: '/policies/termsandconditions',
    loadAnimation: () => {},
    exitAnimation: () => {},
  },
  privacyPolicy: {
    route: '/policies/privacypolicy',
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
  let timeline;

  new Promise((resolve, reject) => {
    Object.entries(ROUTE_LOOKUP).forEach(([k, v]) => {
      // console.log('v.route, pathname -', v.route, pathname);
      if (v.route === pathname) {
        // console.log('found', v);
        resolve(v);
      }
    });
    reject();
  }).then((route) => {
    console.log('found route', route);
    timeline = route.loadAnimation(node, delay, authenticated);
  }).catch(() => {
    console.log('using default route', ROUTE_LOOKUP.default);
    timeline = ROUTE_LOOKUP.default.loadAnimation(node, delay, authenticated);
  });

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

  // const timeline = new Timeline({ paused: true });

  // timeline.to(node, 0.3, { autoAlpha: 0, ease: Power1.easeOut });
  // timeline.play();

  let timeline;

  new Promise((resolve, reject) => {
    Object.entries(ROUTE_LOOKUP).forEach(([k, v]) => {
      // console.log('v.route, pathname -', v.route, pathname);
      if (v.route === pathname) {
        // console.log('found', v);
        resolve(v);
      }
    });
    reject();
  }).then((route) => {
    console.log('found route', route);
    timeline = route.exitAnimation(node, authenticated);
  }).catch(() => {
    console.log('using default route', ROUTE_LOOKUP.default);
    timeline = ROUTE_LOOKUP.default.exitAnimation(node, authenticated);
  });

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
      display: 'none', autoAlpha: 0, delay, ease: Power1.easeIn,
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
  const content = node.querySelector('span');

  console.log('defaultExit', node);

  timeline
    .to(node, 0.3, { display: 'none', autoAlpha: 0, ease: Power1.easeOut })
    .to(content, 0.15, { autoAlpha: 0, y: -25, ease: Power1.easeInOut });

  return timeline;
};
