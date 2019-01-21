package main

import (
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/dali-lab/dplanner/spider/pkg/layuplist"
	"github.com/dali-lab/dplanner/spider/pkg/registrar"
	"github.com/gin-gonic/gin"
)

func getMainEngine() *gin.Engine {
	r := gin.Default()
	r.Use(gin.Logger())

	r.GET("/", func(c *gin.Context) {
		c.String(200, "🏠")
	})
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "🏓",
		})
	})
	r.GET("/term", func(c *gin.Context) {
		id, err := registrar.Term("https://oracle-www.dartmouth.edu/dart/groucho/timetable.subject_search?distribradio=alldistribs&subjectradio=allsubjects&termradio=selectterms&hoursradio=allhours&terms=no_value&depts=no_value&periods=no_value&distribs=no_value&distribs_i=no_value&distribs_wc=no_value&sortorder=dept&pmode=public&term=&levl=&fys=n&wrt=n&pe=n&review=n&crnl=no_value&classyear=2008&searchtype=Subject+Area%28s%29")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, strconv.Itoa(id))
	})
	r.GET("/courses", func(c *gin.Context) {
		c.File("./assets/courses.json")
	})
	r.POST("/course/layup/id", func(c *gin.Context) {
		subj := c.PostForm("subj")
		num := c.PostForm("num")
		id, err := layuplist.Fetch("https://www.layuplist.com", subj, num)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, id)
	})
	r.GET("/course/related/:id", func(c *gin.Context) {
		id := c.Param("id")
		courses, err := layuplist.SimilarCourses("https://www.layuplist.com/course/" + id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, courses)
	})
	r.GET("/course/medians/:id", func(c *gin.Context) {
		id := c.Param("id")
		medians, err := layuplist.Median("https://www.layuplist.com/api/course/" + id + "/medians")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, medians)
	})
	r.GET("/course/professors/:id", func(c *gin.Context) {
		id := c.Param("id")
		profs, err := layuplist.Professors("https://www.layuplist.com/api/course/" + id + "/professors")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, profs)
	})

	return r
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("$PORT must be set")
	}
	getMainEngine().Run(":" + port)
}
