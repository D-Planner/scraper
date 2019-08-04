const fetch = require('isomorphic-fetch');

const data = {
  email: 'admin',
  password: 'password',
  userName: 'admin',
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

  return fetch('http://localhost:9090/courses/create', {
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
  });
}).then((r) => {
  return r.json();
})
  .then((r) => {
    console.log(r);
  })
  .catch((e) => {
    console.log(e);
  });
