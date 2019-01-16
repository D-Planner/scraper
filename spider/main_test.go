package main

import (
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
)

func TestMain(t *testing.T) {
	ts := httptest.NewServer(getMainEngine())
	defer ts.Close()

	tt := []struct {
		name   string
		method string
		url    string
		values url.Values
	}{
		{name: "/ is performed correctly", method: "GET", url: ts.URL + "/", values: nil},
		{name: "/ping is performed correctly", method: "GET", url: ts.URL + "/ping", values: nil},
		{name: "/term is performed correctly", method: "GET", url: ts.URL + "/term", values: nil},
		{name: "/courses is performed correctly", method: "GET", url: ts.URL + "/courses", values: nil},
		{name: "/course/layup/id is performed correctly", method: "POST", url: ts.URL + "/course/layup/id", values: url.Values{"subj": {"mus"}, "num": {"051"}}},
		{name: "/course/related/:id is performed correctly", method: "GET", url: ts.URL + "/course/related/703", values: nil},
		{name: "/course/medians/:id is performed correctly", method: "GET", url: ts.URL + "/course/medians/2158", values: nil},
		{name: "/course/professors/:id is performed correctly", method: "GET", url: ts.URL + "/course/professors/680", values: nil},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {
			switch tc.method {
			case "GET":
				resp, err := http.Get(tc.url)
				if err != nil {
					t.Log(err)
				}
				defer resp.Body.Close()
			case "POST":
				resp, err := http.PostForm(tc.url,
					tc.values)
				if err != nil {
					t.Log(err)
				}
				defer resp.Body.Close()
			}
		})
	}
}
