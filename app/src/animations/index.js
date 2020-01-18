import { TimelineMax as Timeline, Power1 } from 'gsap';

export const ROUTE_LOOKUP = {
  home: { // Needs authentication
    route: '/',
    loadAnimation: (node, delay, authenticated) => (authenticated ? getDPlanTimeline(node, delay) : getHomeTimeline(node, delay)),
    exitAnimation: {},
  },
  course: {
    route: '/course/:id',
    loadAnimation: {},
    exitAnimation: {},
  },
  professor: {
    route: '/professors/:id',
    loadAnimation: {},
    exitAnimation: {},
  },
  discover: {
    route: '/discover',
    loadAnimation: {},
    exitAnimation: {},
  },
  credits: {
    route: '/credits',
    loadAnimation: {},
    exitAnimation: {},
  },
  verifyEmail: {
    route: '/email/:key',
    loadAnimation: {},
    exitAnimation: {},
  },
  resetPassword: {
    route: '/pass/:key',
    loadAnimation: {},
    exitAnimation: {},
  },
  forgotPassword: {
    route: '/reset/pass',
    loadAnimation: {},
    exitAnimation: {},
  },
  tutorial: { // Needs authentication
    route: '/tutorial/:page',
    loadAnimation: {},
    exitAnimation: {},
  },
  termsAndConditions: {
    route: '/policies/termsandconditions',
    loadAnimation: {},
    exitAnimation: {},
  },
  privacyPolicy: {
    route: '/policies/privacypolicy',
    loadAnimation: {},
    exitAnimation: {},
  },
  fallback: {
    loadAnimation: {},
    exitAnimation: {},
  },
  default: {
    loadAnimation: (node, delay) => getDefaultTimeline(node, delay),
    exitAnimation: {},
  },
};

export const play = (pathname, node, appears, authenticated) => {
  const delay = appears ? 0 : 0.5;
  let timeline;

  new Promise((resolve, reject) => {
    Object.entries(ROUTE_LOOKUP).forEach(([k, v]) => {
      console.log('v.route, pathname -', v.route, pathname);
      if (v.route === pathname) {
        console.log('found', v);
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

const getHomeTimeline = (node, delay) => {
  const timeline = new Timeline({ paused: true });
  const texts = node.querySelectorAll('span');

  timeline
    .from(node, 0, { display: 'none', autoAlpha: 0, delay })
    .staggerFrom(texts, 0.375, { autoAlpha: 0, x: -25, ease: Power1.easeOut }, 0.125);

  return timeline;
};

const getDPlanTimeline = (node, delay) => {
  const timeline = new Timeline({ paused: true });

  timeline.from(node, 0.3, { opacity: 0, delay });

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
