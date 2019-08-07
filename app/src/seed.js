const fetch = require('isomorphic-fetch');

const cosc = require('../../api/static/data/majors/cosc.json');

const majors = [cosc];

console.log(majors);


const data = {
  email: 'admin',
  password: 'password',
  userName: 'admin',
};

const seedCourses = (token) => {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:9090/courses/create', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
    }).then((d) => {
      return fetch('http://localhost:9090/courses/create', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'POST',
      });
    }).then((r) => {
      return r.json();
    }).then((r) => {
      console.log(r);
      resolve();
    })
      .catch((e) => {
        console.log(e);
        reject();
      });
  });
};

fetch('http://localhost:9090/auth/signup', {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  method: 'POST',
  body: JSON.stringify(data),
}).then((r) => {
  return r.json();
}).then((r) => {
  const { token } = r;

  return Promise.all(majors.map((major) => {
    return fetch('http://localhost:9090/majors/upload', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(major),
    });
  }).concat(seedCourses(token)));
}).then((r) => {
  return r.json();
})
  .then((r) => {
    console.log(r);
  })
  .catch((e) => {
    console.log(e);
  });
