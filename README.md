# D-Planner
D-Planner is a digital course planner at Dartmouth College. It aims to help students make course decisions based on data gathered from various systems—including Layup List and the ORC.

![screenshot 1](https://github.com/dali-lab/dplanner/blob/master/app/assets/showcase/plan.png "Your Personal Plan")

![screenshot 1](https://github.com/dali-lab/dplanner/blob/master/app/assets/showcase/course.png "Unparalleled Course Data")


## Architecture
The project is built on top of [Node.js](https://nodejs.org/en/), [Express](http://expressjs.com/), [React](https://reactjs.org/), and [Go](https://golang.org/). It also contains modern web development tools such as [Webpack](http://webpack.github.io/), [Babel](https://babeljs.io/), and [ESLint](https://eslint.org/).
The directory structure is used to achieve a separation of concerns between these projects:
```
.
├──api/                         # Express server
├──app/                         # React app
└──spider/                      # Web scraper
```

## Setup
Before you begin, you'll need to have the following installed:
1. [Node](https://nodejs.org/en/)
2. [npm](https://www.npmjs.com/get-npm) or [Yarn](https://yarnpkg.com/lang/en/docs/install/#mac-stable)
3. [MongoDB](https://docs.mongodb.com/manual/installation/#mongodb-community-edition)

> If you want to build the app (without running a development server), go to `app/` and run: `yarn build`

#### 1. Get the latest version
Start by cloning D-Planner:
```
git clone git@github.com:dali-lab/dplanner.git
cd dplanner
```

#### 2. Start the server
Next, install run-time dependencies and developer tools:

```
cd api
yarn
```

...then start the server

```
yarn dev
```

Your output should resemble the following:

```
yarn run v1.6.0
$ babel-node src/server.js
listening on: 9090
```

_NOTE: Yarn is optional but highly recommended over npm_

#### 3. Configure the app
Open a new tab in your terminal and navigate to the app directory:

```
cd app
```

...then repeat step 2 from above:

```
yarn && yarn start
```

The last command will output:

```
yarn run v1.6.0
$ NODE_ENV=development webpack-serve ./webpack.config.js
ℹ ｢hot｣: WebSocket Server Listening on localhost:59739
ℹ ｢hot｣: Applying DefinePlugin:__hotClientOptions__
ℹ ｢hot｣: webpack: Compiling...
ℹ ｢serve｣: Serving Static Content from: /
ℹ ｢serve｣: Project is running at http://localhost:8080
ℹ ｢serve｣: Server URI copied to clipboard
ℹ ｢hot｣: webpack: Compiling Done
ℹ ｢wdm｣: Hash: 34bc1a543a74d58fa5ae
Version: webpack 4.28.4
Time: 3594ms
Built at: 01/20/2019 11:59:59 AM
       Asset       Size  Chunks             Chunk Names
  ./200.html  449 bytes          [emitted]
./index.html  449 bytes          [emitted]
     main.js   2.24 MiB    main  [emitted]  main
 main.js.map   2.13 MiB    main  [emitted]  main
Entrypoint main = main.js main.js.map
[...]
ℹ ｢wdm｣: Compiled successfully.
```

> For instructions on how to run the spider locally, see the [README.md](https://github.com/dali-lab/dplanner/blob/master/spider/README.md) in `/spider`

#### 4. Seeding the Mongo Database

Start the API. - ` yarn dev `

In ` /app ` run ` yarn seed `

This will create a user with username (admin) and password (password) You may now start the app and login with those credentials.

## Deployment
Each sub-directory contains a [Procfile](https://devcenter.heroku.com/articles/procfile) that's used to deploy its respective app to Heroku. As such, the following steps could be used to deploy any of the projects contained in this repository; otherwise, additional steps can be located in the README.md of the project's sub-directory.

To begin, check that you've installed the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli):

```
heroku
```
...then login and create a new project:

```
heroku login
```

This should prompt you to login:

```
heroku: Press any key to open up the browser to login or q to exit:
Logging in... done
Logged in as raul.f.rodriguez.19@dartmouth.edu
```

Next, create a new project:

```
heroku create
```

If all goes well, you should see something similar to:

```
Creating app... done, ⬢ shielded-shelf-80656
https://shielded-shelf-80656.herokuapp.com/ | https://git.heroku.com/shielded-shelf-80656.git
```

Finally add, commit, and push your changes to Heroku. Note that the `git push` command deploys via [git-subtree](https://github.com/apenwarr/git-subtree/blob/master/git-subtree.txt) to push the folder `/api` as the root to Heroku, thereby ignoring the other top-level directories:

```
git add .
git commit -m "all the code"
git subtree push --prefix api heroku master
```

## Authors
* Christina Bae (Designer)
* Zirui Hao (Partner, Project Manager)
* Maddie Hess (Developer)
* Adam McQuilkin (Partner, Project Manager)
* Adam Rinehouse (Developer)
* Raul Rodriguez (Developer)
* Regina Yan (Designer)
* Gillian Yue (Partner, Developer)

### Acknowledgments
[Tim](https://github.com/timofei7) for the most useful [site](http://cs52.me/) on architecting web applications

---
Designed and developed by [@DALI Lab](https://github.com/dali-lab)
