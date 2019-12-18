import dartmouthBlocks from '../../assets/miscellaneous/dartmouth_blocks.json';
// need to import ical-generator

export const makeCal = (userCourses) => {
  const dayOfWeek = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
  // Need to decide how to deal with these dates. Might need to save this data in Globals for the current term.
  // Good Idea
  const termStart = new Date('January 3 2019');
  const termEnd = new Date('March 13 2019');
  let startTime = new Date();
  let endTime = new Date();

  userCourses.forEach((userCourse) => {
    const block = dartmouthBlocks.find((e) => {
      return e.name === userCourse.timeslot;
    });
    block.slots.forEach((slot) => {
      const event = cal.createEvent();
      let i = termStart.getDay();
      let j = 3;
      while (j <= 10) {
        const day = `January ${j} 2019`;
        if (slot.days) {
          if (slot.days.includes(dayOfWeek[i])) {
            startTime = new Date(`${day} ${slot.start}`);
            endTime = new Date(`${day} ${slot.end}`);
            break;
          }
          j += 1;
          i += 1;
          if (i === 7) { i = 0; }
        }
      }
      event.summary(`${userCourse.course.name} ${slot.name !== '' ? `: ${slot.name}` : ''}`);
      event.start(startTime);
      event.end(endTime);
      event.repeating({
        freq: 'WEEKLY',
        byDay: slot.days,
        until: termEnd,
      });
    });
  });
};
