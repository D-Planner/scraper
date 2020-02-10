# Spider
The spider package is a web scraper that aggregates course data from the [ORC](https://oracle-www.dartmouth.edu/dart/groucho/timetable.main) and [Layup List](https://www.layuplist.com). It's exposed through a RESTful API whose Postman collection is described [below](#postman-👩‍🚀).

## Getting Started
To run the 🕷️ without any 😩, open your terminal and enter the following command:

```
PORT="8080" \
ORC_URL="https://oracle-www.dartmouth.edu/dart/groucho/timetable.display_courses" \
LAYUP_URL="https://www.layuplist.com" \
LAYUP_COOKIE="__cfduid=d1c489445b2ea23ce62a0453fb7365a8e1581356219; _ga=GGA1.2.777740150.1578002484; _gid=GA1.2.1146741920.1581359572; _gat=1; sessionid=3v4d8j9yh6300gxww2namwfuxzt3lvk5; csrftoken=wglx4RgDv8Js1nJ7eY0ePDYGJG4GdpcRd8LnrsF9ihooZIj4guDZsGAOuBO40Tyo" \
./bin/spider
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

[GIN-debug] GET    /                         --> github.com/dali-lab/dplanner/spider/server.setupRouter.func1 (5 handlers)
[GIN-debug] GET    /ping                     --> github.com/dali-lab/dplanner/spider/server.setupRouter.func2 (5 handlers)
[GIN-debug] GET    /scrape                   --> github.com/dali-lab/dplanner/spider/server.setupRouter.func3 (5 handlers)
[GIN-debug] GET    /courses                  --> github.com/dali-lab/dplanner/spider/server.setupRouter.func4 (5 handlers)
[GIN-debug] GET    /timetable                --> github.com/dali-lab/dplanner/spider/server.setupRouter.func5 (5 handlers)
[GIN-debug] GET    /departments              --> github.com/dali-lab/dplanner/spider/server.setupRouter.func6 (5 handlers)
[GIN-debug] GET    /courses/:dept            --> github.com/dali-lab/dplanner/spider/server.setupRouter.func7 (5 handlers)
[GIN-debug] Listening and serving HTTP on :8080
```

## Documentation
For full documentation of the Go packages, enter the following command in your terminal:
```
godoc -http=:6060
```

... then enter the following URL in your browser:
```
http://localhost:6060/pkg/github.com/dali-lab/dplanner/spider/
```

## Postman 👩‍🚀
Here's a Postman collection for the API:

| Method | Description | Endpoint |
| --- | --- | --- |
| GET | Index  | `/` |
| GET | Health check  | `/ping` |
| GET | Scraping process (~5-10 mins) | `/scrape` |
| GET | Courses | `/courses` |
| GET | Departments  | `/departments` |
| GET | ORC timetable (past 4 yrs)  | `/timetable` |
| GET | Department's course offerings | `/courses/:dept` |

... click below to run it in your browser

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/4345820/S1Zudr5D?version=latest)
