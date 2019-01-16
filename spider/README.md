# Spider [![codecov](https://codecov.io/gh/dali-lab/dplanner/branch/code_experiment_0/graph/badge.svg?token=jiPXFTJ4fn)](https://codecov.io/gh/dali-lab/dplanner)
The spider package is restful API that scrapes the scrapes the [ORC](https://oracle-www.dartmouth.edu/dart/groucho/timetable.main) and [Layup List](https://www.layuplist.com/) to provide aggregate course data to students. The API is deployed [here](https://limitless-forest-87283.herokuapp.com).

## Install
With a [correctly configured](https://golang.org/doc/install#testing) Go toolchain:
```
go get github.com/dali-lab/dplanner/spider
```

## Getting Started
To run without any configuration:

```
PORT=5000 ./bin/main
```

...or develop:

```
go run main.go
```

You should see the following:

```
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
 - using env:   export GIN_MODE=release
 - using code:  gin.SetMode(gin.ReleaseMode)

[GIN-debug] GET    /                         --> main.getMainEngine.func1 (4 handlers)
[GIN-debug] GET    /ping                     --> main.getMainEngine.func2 (4 handlers)
[GIN-debug] GET    /term                     --> main.getMainEngine.func3 (4 handlers)
[GIN-debug] GET    /courses                  --> main.getMainEngine.func4 (4 handlers)
[GIN-debug] POST   /course/layup/id          --> main.getMainEngine.func5 (4 handlers)
[GIN-debug] GET    /course/related/:id       --> main.getMainEngine.func6 (4 handlers)
[GIN-debug] GET    /course/medians/:id       --> main.getMainEngine.func7 (4 handlers)
[GIN-debug] GET    /course/professors/:id    --> main.getMainEngine.func8 (4 handlers)
[GIN-debug] Listening and serving HTTP on :8080
```

## Documentation
For full documentation of the source code:

```
godoc -http=:6060
```

Then navigate to the URL:
```
http://localhost:6060/pkg/github.com/dali-lab/dplanner/spider/
```

## API Collection 👩‍🚀
Here's a Postman collection for the spider API deployed on Heroku:

| Method | Description | Endpoint |
| --- | --- | --- |
| GET | Index  | `/` |
| GET | Health-check  | `/ping` |
| GET | Rerturns the current term's ID per ORC specification  | `/term` |
| GET | Fetch course offerings for the current term  | `/courses` |
| GET | Returns a list of similar courses  | `/course/related/:id` |
| GET | Returns a list of professors who've taught and are currently teaching a course  | `/course/professors/:id` |
| GET | Returns metadata about a course's median across the terms it was offered | `/course/medians/:id` |
| POST | Fetches a course's ID on Layup List via `subj` + `num` (i.e. `mus051`)  | `/id` |

Click below to try out the API and see some examples.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/e5a78fa13b99cd034f72)
