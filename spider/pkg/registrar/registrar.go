package registrar

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

// Course represents a course entry in the ORC's data table
type Course struct {
	Term       int    `json:"term"`
	CRN        int    `json:"crn"`
	Subj       string `json:"subject"`
	Num        int    `json:"number"`
	Sec        int    `json:"section"`
	Title      string `json:"cross_list"`
	Text       string `json:"text:"`
	Xlist      string `json:"xlist"`
	Period     string `json:"period"`
	Room       string `json:"room"`
	Building   string `json:"building"`
	Instructor string `json:"instructor"`
	WC         string `json:"wc"`
	Dist       string `json:"distirb"`
	Lim        int    `json:"enrollment_limit"`
	Enrl       int    `json:"current_enrollment"`
	Status     string `json:"status"`
	LrnObj     string `json:"learning_objective"`
}

// Fetch scrapes the current term's course offerings from the ORC
func Fetch(url string) ([]Course, error) {
	res, err := http.PostForm(url, nil)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	doc, _ := goquery.NewDocumentFromReader(res.Body)

	var c []Course

	doc.Find("div.data-table > table > tbody > tr").Each(func(i int, s *goquery.Selection) {
		term, _ := strconv.Atoi(strings.TrimSpace(s.Find("td:first-of-type").Text()))
		crn, _ := strconv.Atoi(strings.TrimSpace(s.Find("td:nth-of-type(2)").Text()))
		subj := strings.TrimSpace(s.Find("td:nth-of-type(3)").Text())
		num, _ := strconv.Atoi(strings.TrimSpace(s.Find("td:nth-of-type(4)").Text()))
		sec, _ := strconv.Atoi(strings.TrimSpace(s.Find("td:nth-of-type(5)").Text()))
		title := strings.TrimSpace(s.Find("td:nth-of-type(6)").Text())
		text, _ := s.Find("td:nth-of-type(7) > a").Attr("href")
		xlist := strings.TrimSpace(s.Find("td:nth-of-type(8)").Text())
		period := strings.TrimSpace(s.Find("td:nth-of-type(9)").Text())
		room := strings.TrimSpace(s.Find("td:nth-of-type(10)").Text())
		building := strings.TrimSpace(s.Find("td:nth-of-type(11)").Text())
		instructor := strings.TrimSpace(s.Find("td:nth-of-type(12)").Text())
		wc := strings.TrimSpace(s.Find("td:nth-of-type(13)").Text())
		dist := strings.TrimSpace(s.Find("td:nth-of-type(14)").Text())
		lim, _ := strconv.Atoi(strings.TrimSpace(s.Find("td:nth-of-type(15)").Text()))
		enrl, _ := strconv.Atoi(strings.TrimSpace(s.Find("td:nth-of-type(16)").Text()))
		status := strings.TrimSpace(s.Find("td:nth-of-type(17)").Text())
		lrnobj, _ := s.Find("td:nth-of-type(18) > a").Attr("href")

		c = append(c, Course{
			Term:       term,
			CRN:        crn,
			Subj:       subj,
			Num:        num,
			Sec:        sec,
			Title:      title,
			Text:       strings.Trim(strings.TrimSpace(text), `javascript:reqmat_window('')`),
			Xlist:      xlist,
			Period:     period,
			Room:       room,
			Building:   building,
			Instructor: instructor,
			WC:         wc,
			Dist:       dist,
			Lim:        lim,
			Enrl:       enrl,
			Status:     status,
			LrnObj:     strings.TrimSpace(strings.Trim(lrnobj, `javascript:reqmat_window('')`)),
		})
	})

	c = append(c[:0], c[0+1:]...)

	file, err := os.Create("./assets/courses.json")
	if err != nil {
		return nil, err
	}
	json, err := json.MarshalIndent(c, "", "\t")
	if err != nil {
		fmt.Println("error:", err)
	}
	file.Write(json)

	return c, nil
}

// Term returns the term of the current academic calender
func Term(url string) (int, error) {
	res, err := http.PostForm(url, nil)
	if err != nil {
		return 0, err
	}
	defer res.Body.Close()

	doc, _ := goquery.NewDocumentFromReader(res.Body)
	str, _ := doc.Find("#term1").Attr("value")
	term, _ := strconv.Atoi(str)

	return term, nil
}
