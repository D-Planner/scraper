package layuplist

import (
	"encoding/json"
	"errors"
	"net/http"
	"regexp"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

// CourseMetadata represents is a grab bag of course statistics
type CourseMetadata struct {
	Medians []struct {
		Term    string `json:"term"`
		Courses []struct {
			Enrollment   int     `json:"enrollment"`
			Median       string  `json:"median"`
			NumericValue float64 `json:"numeric_value"`
			Section      int     `json:"section"`
		} `json:"courses"`
		AvgNumericValue float64 `json:"avg_numeric_value"`
	} `json:"medians"`
}

// Instructors is a list of professors who've taught a course
type Instructors struct {
	Professors []string `json:"professors"`
}

// Fetch fetches a course's Layup List ID.
func Fetch(url, subj, num string) (string, error) {
	resp, err := http.Get(url + "/search?q=" + subj + "+" + num)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	re, _ := regexp.Compile("/course/(.*)")
	values := re.FindStringSubmatch(resp.Request.URL.String())
	if len(values) > 0 {
		return values[1], nil
	}

	return "", errors.New("ID not found for query: " + "subj + " + "num")
}

// Median returns a course's median and enrollment history for each term it was offered
func Median(url string) (CourseMetadata, error) {
	resp, err := http.Get(url)
	if err != nil {
		return CourseMetadata{}, err
	}
	defer resp.Body.Close()

	var c CourseMetadata

	json.NewDecoder(resp.Body).Decode(&c)

	return c, nil
}

// Professors returns a course's current and past professors
func Professors(url string) (Instructors, error) {
	resp, err := http.Get(url)
	if err != nil {
		return Instructors{}, err
	}
	defer resp.Body.Close()

	var i Instructors

	json.NewDecoder(resp.Body).Decode(&i)

	return i, nil
}

// Course is a similar course
type Course struct {
	Title string
	URI   string
}

// SimilarCourses returns a list of related courses
func SimilarCourses(url string) ([]Course, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var c []Course

	doc, _ := goquery.NewDocumentFromReader(resp.Body)
	doc.Find("div > div > table > tbody > tr").Each(func(i int, s *goquery.Selection) {
		uri, _ := s.Attr("onclick")
		re, _ := regexp.Compile("window.document.location='(.*)'")
		values := re.FindStringSubmatch(uri)
		if len(values) > 0 {
			if strings.Contains(values[1], "/review_search?q=") == false {
				c = append(c, Course{
					Title: strings.TrimSpace(s.Find("a").Text()),
					URI:   values[1],
				})
			}
		}
	})

	return c, nil
}
