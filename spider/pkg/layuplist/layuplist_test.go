package layuplist

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
	tt := []struct {
		name   string
		url    string
		subj   string
		num    string
		result string
	}{
		{name: "fetch is performed correctly", url: "https://www.layuplist.com", subj: "mus", num: "051", result: "2158"},
		{name: "fetch returns an error when given a bad url", url: "layupawesome.xyz", subj: "", num: "", result: ""},
		{name: "fetch returns an error when ID is not found", url: "https://www.layuplist.com", subj: "fun", num: "101", result: ""},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			res, err := Fetch(tc.url, tc.subj, tc.num)
			if err != nil {
				t.Log(err)
			}
			if tc.result != res {
				t.Logf("Expected %v; got %v", tc.result, res)
			}
		})
	}
}

func TestMedian(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		render(w, "layuplist/api/medians/2158.json")
	}))
	defer ts.Close()

	tt := []struct {
		name string
		url  string
	}{
		{name: "median is performed correctly", url: ts.URL},
		{name: "returns an error when given a bad url", url: "layupawesome.xyz"},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			_, err := Median(tc.url)
			if err != nil {
				t.Log(err)
			}
		})
	}
}

func TestProfessors(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		render(w, "layuplist/api/professors/680.json")
	}))
	defer ts.Close()

	tt := []struct {
		name string
		url  string
	}{
		{name: "median is performed correctly", url: ts.URL},
		{name: "returns an error when given a bad url", url: "layupawesome.xyz"},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			_, err := Professors(tc.url)
			if err != nil {
				t.Log(err)
			}
		})
	}
}

func TestSimilarCourses(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		render(w, "layuplist/course/680.html")
	}))
	defer ts.Close()

	courses := []Course{
		{
			Title: "ENGS020: Introduction to Scientific Computing",
			URI:   "/course/1090",
		},
		{
			Title: "MUS008: Programming for Interactive Audio-Visual Art",
			URI:   "/course/2124",
		},
		{
			Title: "COSC059: Principles of Programming Languages",
			URI:   "/course/703",
		},
	}

	tt := []struct {
		name   string
		url    string
		result []Course
	}{
		{name: "similar courses is performed correctly", url: ts.URL, result: courses},
		{name: "similar courses throws an error when given a bad URL", url: "layupawesome.xyz", result: nil},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			res, err := SimilarCourses(tc.url)
			if err != nil {
				t.Log(err)
			}
			if tc.result != nil {
				if res[0] != tc.result[0] {
					t.Logf("Expected %v; got %v", tc.result[0], res[0])
				}
				if res[1] != tc.result[1] {
					t.Logf("Expected %v; got %v", tc.result[1], res[1])
				}
				if res[2] != tc.result[2] {
					t.Logf("Expected %v; got %v", tc.result[2], res[2])
				}
			}
		})
	}
}
