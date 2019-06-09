package scrape

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/dali-lab/dplanner/spider/pkg/scrape/layuplist"
)

func writeJSON(path string, name string, i interface{}) {
	filename := fmt.Sprintf("%s/%s.json", path, name)

	file, _ := os.Create(filename)

	json, _ := json.MarshalIndent(i, "", "\t")

	file.Write(json)
}

func Init() {
	d := layuplist.NewDepartments()

	writeJSON("data", "departments", d)

	var c []*layuplist.Course

	for i := range d.Departments {
		department := d.Departments[i].Code
		o := layuplist.NewOfferings(department)
		writeJSON("data/courses", strings.ToLower(department), o)

		courses := layuplist.NewCourses(o)
		c = append(c, courses.Courses...)
	}

	writeJSON("data", "courses", c)
}
