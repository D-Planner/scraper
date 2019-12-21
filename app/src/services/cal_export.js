import ical from 'ical-generator';
import dartmouthBlocks from '../../assets/miscellaneous/dartmouth_blocks.json';

const cal = ical({ domain: 'localhost', name: 'my first iCal' });

function download(filename, data) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/calendar;charset=utf-8,${encodeURIComponent(data)}`);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export default function makeCal(userCourses) {
  const dayOfWeek = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
  // Need to decide how to deal with these dates. Might need to save this data in Globals for the current term.
  // Good Idea
  const termStart = new Date('January 6 2020');
  const termEnd = new Date('March 13 2020');
  let startTime = new Date();
  let endTime = new Date();

  userCourses.forEach((userCourse) => {
    const block = dartmouthBlocks.find((e) => {
      return e.name === userCourse.timeslot;
    });
    console.log(block);
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

  download('schedule.ics', cal.toString());
}
