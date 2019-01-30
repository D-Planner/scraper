const csList = [
  {
    name: 'Introduction to Programming and Computation',
    orc_number: 'COSC1',
    id: 0,
    prereqs: [],
  },
  {
    name: 'Data Structures and Algorithms',
    orc_number: 'COSC10',
    id: 1,
    prereqs: ['COSC1'],
  },
  {
    name: 'Software Design and Implementation',
    orc_number: 'COSC50',
    id: 2,
    prereqs: ['COSC10'],
  },
  {
    name: 'Computer Architecture',
    orc_number: 'COSC51',
    id: 3,
    prereqs: [],
  },
  {
    name: 'Operating Systems',
    orc_number: 'COSC58',
    id: 4,
    prereqs: ['COSC51'],
  },
  {
    name: 'Discreet Math in Computer Science',
    orc_number: 'COSC30',
    id: 5,
    prereqs: ['COSC1'],
  },
  {
    name: 'Algorithms',
    orc_number: 'COSC31',
    id: 6,
    prereqs: ['COSC10', 'COSC30'],
  },
];

export const links = [];

// create nodes
const nodes = csList.map((course) => {
  for (const pr of course.prereqs) {
    for (const course2 of csList) {
      if (course2.orc_number === pr) {
        links.push({
          source: course2.id,
          target: course.id,
          color: '#888888',
        });
        break;
      }
    }
  }
  return {
    name: course.name,
    id: course.id,
    orc_number: course.orc_number,
    val: 1,
    color: '#3183ba',
  };
});

export const csData = {
  links,
  nodes,
};
