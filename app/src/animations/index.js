import { TimelineMax as Timeline, Power1 } from 'gsap';

export const play = (pathname, node, appears, authenticated) => {
  const delay = appears ? 0 : 0.5;
  let timeline;

  if (pathname === '/') {
    if (authenticated === true) {
      console.log('dplan');
      timeline = getDPlanTimeline(node, delay);
    } else {
      console.log('gethome');
      timeline = getHomeTimeline(node, delay);
    }
  } else {
    console.log('getDefault');
    timeline = getDefaultTimeline(node, delay);
  }

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
