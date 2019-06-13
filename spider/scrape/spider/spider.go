package spider

import (
	"log"
	"net/http"
	"net/url"
	"time"

	"github.com/PuerkitoBio/goquery"
)

// Spider is a struct for a scraping job
type Spider struct {
	url     string
	cookie  string
	payload url.Values
	doc     *goquery.Document
}

// New creates a new Spider instance
func New(url string, cookie string, payload url.Values) *Spider {
	s := new(Spider)

	s.url = url

	if cookie != "" {
		s.cookie = cookie
	} else {
		s.payload = payload
	}

	s.doc = s.getDocument()

	return s
}

// Find finds an HTML element that matches a selector string
func (s *Spider) Find(selector string) *goquery.Selection {
	return s.doc.Find(selector)
}

func (s *Spider) getDocument() *goquery.Document {
	var res *http.Response

	if s.payload == nil {
		res = s.getResponse()
	} else {
		res = s.postResponse()
	}

	defer res.Body.Close()

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		log.Print(err)
	}
	return doc
}

func (s *Spider) getResponse() *http.Response {
	req, _ := http.NewRequest("GET", s.url, nil)

	req.Header.Set("cookie", s.cookie)

	client := &http.Client{Timeout: time.Second * 25}

	res, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	return res
}

func (s *Spider) postResponse() *http.Response {
	res, err := http.PostForm(s.url, s.payload)
	if err != nil {
		log.Fatal(err)
	}
	return res
}
