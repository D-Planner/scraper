package e2e

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"strings"
	"sync"

	"github.com/PuerkitoBio/goquery"
)

// Payload requests all undergraduate- and graduate-level courses
// for all available terms on the ORC's timetable of class meetings.
// Call the function with string "physical_education" for PE classes.
func payload(s string) url.Values {
	var payload = url.Values{
		"distribradio": {"alldistribs"},
		"depts":        {"no_value"},
		"periods":      {"no_value"},
		"distribs":     {"no_value"},
		"distribs_i":   {"no_value"},
		"distribs_wc":  {"no_value"},
		"pmode":        {"public"},
		"term":         {""},
		"levl":         {""},
		"fys":          {"n"},
		"wrt":          {"n"},
		"pe":           {"n"},
		"review":       {"n"},
		"crnl":         {"no_value"},
		"classyear":    {"2008"},
		"termradio":    {"allterms"},
		"terms":        {"no_value"},
		"subjectradio": {"allsubjects"},
		"hoursradio":   {"allhours"},
		"sortorder":    {"dept"},
	}

	switch s {
	case "physical_education":
		payload.Add("searchtype", "Physical Education")
	default:
		payload.Add("searchtype", "Subject Area(s)")
	}

	return payload
}

// Medians is a struct for storing a course's median,
// section, and enrollment history from 2016 onwards.
// The data is scraped from Layup List, which scrapes
// from here: http://www.dartmouth.edu/~reg/transcript/medians/.
type Medians []struct {
	Term    string `json:"term"`
	Courses []struct {
		Enrollment   int     `json:"enrollment"`
		Median       string  `json:"median"`
		NumericValue float64 `json:"numeric_value"`
		Section      int     `json:"section"`
	} `json:"courses"`
	AvgNumericValue float64 `json:"avg_numeric_value"`
}

// Links holds various hyperlinks for a course.
type Links struct {
	ORC               string `json:"orc"`
	LayupList         string `json:"layuplist"`
	LearningObjective string `json:"learning_objective"`
	Textbook          string `json:"textbook"`
}

// Course defines a course.
type Course struct {
	Term              string   `json:"term"`
	TermsOffered      []string `json:"terms_offered"`
	CRN               int      `json:"crn"`
	Subject           string   `json:"subject"`
	Number            int      `json:"number"`
	Section           int      `json:"section"`
	Title             string   `json:"title"`
	Description       string   `json:"description"`
	LayupListScore    int      `json:"layuplist_score"`
	LayupListID       int      `json:"layuplist_id"`
	Xlist             []int    `json:"xlist"`
	Period            string   `json:"period"`
	Room              string   `json:"room"`
	Building          string   `json:"building"`
	Professors        []string `json:"professors"`
	WC                string   `json:"wc"`
	Distrib           string   `json:"distrib"`
	EnrollmentLimit   int      `json:"enrollment_limit"`
	CurrentEnrollment int      `json:"current_enrollment"`
	Links             Links    `json:"links"`
	RelatedCourses    []int    `json:"related_courses"`
	Medians           Medians  `json:"medians"`
}

func (c *Course) layuplist(s string) error {
	switch s {
	case "medians":
		// Fetches course medians from Layup List's API.
		resp, err := http.Get("https://www.layuplist.com/api/course/" + strconv.Itoa(c.LayupListID) + "/medians")
		if err != nil {
			return err
		}
		defer resp.Body.Close()

		json.NewDecoder(resp.Body).Decode(&c)

		if len(c.Medians) > 0 {
			for _, median := range c.Medians {
				c.TermsOffered = append(c.TermsOffered, median.Term)
			}
		}

		return nil
	case "professors":
		// Fetches course professors from Layup List's API.
		resp, err := http.Get("https://www.layuplist.com/api/course/" + strconv.Itoa(c.LayupListID) + "/professors")
		if err != nil {
			return err
		}
		defer resp.Body.Close()

		json.NewDecoder(resp.Body).Decode(&c)

		return nil
	default:
		// Finds a course's Layup List ID, and, if successful, redirects to course page for metadata.
		resp, err := http.Get("https://www.layuplist.com/search?q=" + c.Subject + "+" + strconv.Itoa(c.Number))
		if err != nil {
			return err
		}
		defer resp.Body.Close()

		re, _ := regexp.Compile("/course/(.*)")
		// Here we filter everything but the URL path segment and course ID.
		// So, we get two elements (e.g. "[/course/680 680]," where links[0]
		// is the string "/course/680" and links[1] is the int 680).
		link := re.FindStringSubmatch(resp.Request.URL.String())
		if len(link) > 0 {
			c.LayupListID, _ = strconv.Atoi(link[1])
			c.Links.LayupList = "https://www.layuplist.com/course/" + link[1]
		}

		doc, _ := goquery.NewDocumentFromReader(resp.Body)

		c.Description = strings.TrimSpace(doc.Find("div:nth-child(1) > div > p:nth-child(3)").Text())

		doc.Find("div > div > table > tbody > tr").Each(func(i int, s *goquery.Selection) {
			link, _ := s.Attr("onclick")
			re, _ := regexp.Compile(`'/course/(.*)'`)
			// This includes links to professor reviews, but we filter them out later.
			links := re.FindStringSubmatch(link)
			if len(links) > 0 {
				if strings.Contains(links[1], "/review_search?q=") == false {
					id, _ := strconv.Atoi(links[1])
					c.RelatedCourses = append(c.RelatedCourses, id)
				}
			}
		})

		// Reference courses by their Layup List ID for consistency.
		doc.Find("p").Each(func(i int, s *goquery.Selection) {
			if strings.Contains(s.Text(), strings.TrimSpace("Crosslisted")) {
				doc.Find("a").Each(func(j int, s *goquery.Selection) {
					link, _ := s.Attr("href")
					re, _ := regexp.Compile("/course/(.*)")
					links := re.FindStringSubmatch(link)
					if len(links) > 0 {
						id, _ := strconv.Atoi(links[1])
						c.Xlist = append(c.Xlist, id)
					}
				})
			}
		})

		// We fetch the ORC link from Layup List because they handle the issue
		// of hashing graduate- and undergaduate-course prefixes—among other things.
		doc.Find("a").Each(func(i int, s *goquery.Selection) {
			link, _ := s.Attr("href")
			if strings.Contains(link, "http://dartmouth.smartcatalogiq.com/en/current/orc/") {
				c.Links.ORC = link
			}
		})

		// This is the "said it was good" score (i.e. "quality score"
		// on the "Best Classes" page); "called it a layup" (i.e. "layup score")
		// requires authentication, which suggests this data shouldn't be exposed
		// beyond the Dartmouth community. We should probably make sure only
		// Dartmouth emails are allowed to register on our site before implementing
		// the latter.
		c.LayupListScore, _ = strconv.Atoi(strings.TrimSpace(doc.Find("h2.score").Text()))

		return nil
	}
}

// Scrape fetches the latest course offerings from the ORC, and
// fills missing information from LayupList through goroutines.
func Scrape() ([]Course, error) {
	resp, err := http.PostForm("https://oracle-www.dartmouth.edu/dart/groucho/timetable.display_courses/", payload(""))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	doc, _ := goquery.NewDocumentFromReader(resp.Body)

	courses := []Course{}

	var wg sync.WaitGroup

	rows := doc.Find("div.data-table > table > tbody > tr")

	wg.Add(rows.Size())

	rows.Each(func(i int, s *goquery.Selection) {
		c := Course{}

		// This data is required for the next steps.
		switch s.Find("td:nth-child(1)").Text() {
		case "201901":
			c.Term = "19W"
		case "201809":
			c.Term = "18F"
		case "201806":
			c.Term = "18X"
		case "201803":
			c.Term = "18S"
		}

		c.CRN, _ = strconv.Atoi(strings.TrimSpace(s.Find("td:nth-child(2)").Text()))
		c.Subject = strings.TrimSpace(s.Find("td:nth-child(3) > a").Text())
		c.Number, _ = strconv.Atoi(strings.TrimSpace(s.Find("td:nth-child(4)").Text()))
		c.Section, _ = strconv.Atoi(strings.TrimSpace(s.Find("td:nth-child(5)").Text()))
		c.Title = strings.TrimSpace(s.Find("td:nth-child(8) > a").Text())
		c.Period = strings.TrimSpace(s.Find("td:nth-child(11)").Text())
		c.Room = strings.TrimSpace(s.Find("td:nth-child(12)").Text())
		c.Building = strings.TrimSpace(s.Find("td:nth-child(13)").Text())
		c.WC = strings.TrimSpace(s.Find("td:nth-child(15)").Text())
		c.Distrib = strings.TrimSpace(s.Find(" td:nth-child(16)").Text())
		c.EnrollmentLimit, _ = strconv.Atoi(strings.TrimSpace(s.Find("td:nth-child(17)").Text()))
		c.CurrentEnrollment, _ = strconv.Atoi(strings.TrimSpace(s.Find("td:nth-child(18)").Text()))

		// Strip unnecessary and obsolete attributes from links.
		textbook, _ := s.Find("td:nth-child(9) > a").Attr("href")
		learningObjective, _ := s.Find("td:nth-child(20) > a").Attr("href")
		c.Links.Textbook = strings.Trim(strings.TrimSpace(textbook), `javascript:reqmat_window('')`)
		c.Links.LearningObjective = strings.TrimSpace(strings.Trim(learningObjective, `javascript:reqmat_window('')`))

		// Get the course's Layup List ID and other metadata.
		c.layuplist("")

		// Fetch the rest of the data concurrently with a Go routine
		go func() {
			defer wg.Done()

			// ...then, fetch medians
			c.layuplist("medians")

			// ...and finally fetch professors
			c.layuplist("professors")
		}()

		courses = append(courses, c)

		fmt.Println(c)
	})

	wg.Wait()

	// Remove headers.
	courses = append(courses[:0], courses[0+1:]...)

	file, _ := os.Create("courses.json")

	// Pretty print JSON.
	json, _ := json.MarshalIndent(courses, "", "\t")

	file.Write(json)

	return courses, nil
}
