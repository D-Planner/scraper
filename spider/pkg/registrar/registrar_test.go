package registrar

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"
)

func render(w http.ResponseWriter, tmpl string) {
	tmpl = fmt.Sprintf("../../testdata/%s", tmpl)
	t, err := template.ParseFiles(tmpl)
	if err != nil {
		log.Print("template parsing error: ", err)
	}
	err = t.Execute(w, "")
	if err != nil {
		log.Print("template executing error: ", err)
	}
}

func TestFetch(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		render(w, "registrar/timetable/display_courses.html")
	}))
	defer ts.Close()

	courses := []Course{
		{
			Term:       201901,
			CRN:        10452,
			Subj:       "AAAS",
			Num:        10,
			Sec:        1,
			Title:      "Intro African Amer Studies",
			Text:       "https://oracle-www.dartmouth.edu/dart/groucho/course_desc.display_non_fys_req_mat?p_term=201901&p_crn=10452",
			Xlist:      "",
			Period:     "2A",
			Room:       "107",
			Building:   "Dartmouth Hall",
			Instructor: "Shalene Moodie",
			WC:         "CI",
			Dist:       "SOC",
			Lim:        25,
			Enrl:       6,
			Status:     "IP",
			LrnObj:     "",
		},
		{
			Term:       201901,
			CRN:        10199,
			Subj:       "AAAS",
			Num:        13,
			Sec:        1,
			Title:      "Black Amer Since Civil War",
			Text:       "https://oracle-www.dartmouth.edu/dart/groucho/course_desc.display_non_fys_req_mat?p_term=201901&p_crn=10199",
			Xlist:      "HIST 017 01",
			Period:     "2A",
			Room:       "First",
			Building:   "Cutter/Shabazz",
			Instructor: "Derrick White",
			WC:         "W",
			Dist:       "SOC",
			Lim:        36,
			Enrl:       6,
			Status:     "IP",
			LrnObj:     "",
		},
	}

	tt := []struct {
		name   string
		result []Course
		url    string
	}{
		{name: "fetch is performed correctly", result: courses, url: ts.URL},
		{name: "fetch returns an error when given a bad url", result: courses, url: "myawesomecoursecatalog.xyz"},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			res, err := Fetch(tc.url)
			if err != nil {
				t.Log(err)
			}

			if res != nil {
				if res[1] != tc.result[0] {
					t.Logf("Expected %v; got %v", tc.result[0], res[1])
				}
				if res[2] != tc.result[1] {
					t.Logf("Expected %v; got %v", tc.result[1], res[2])
				}
			}
		})
	}
}

func TestTerm(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		render(w, "registrar/timetable/subject_search.html")
	}))
	defer ts.Close()

	tt := []struct {
		name   string
		result int
		url    string
	}{
		{name: "term is performed correctly", result: 201901, url: ts.URL},
		{name: "term throws an error when given a bad URL", result: 0, url: "myawesomecoursecatalog.xyz"},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			res, err := Term(tc.url)
			if err != nil {
				t.Log(err)
			}

			if tc.result != 0 {
				if res != tc.result {
					t.Logf("Expected %v; got %v", tc.result, res)
				}
			}
		})
	}
}
