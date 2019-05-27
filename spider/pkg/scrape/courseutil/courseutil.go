package courseutil

import (
	"regexp"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func SimilarID(s string) int {
	pattern, _ := regexp.Compile("'/course/(.*)'")

	submatches := pattern.FindStringSubmatch(s)

	if submatches != nil && !strings.Contains(submatches[1], "/review_search?q=") {
		id, _ := strconv.Atoi(submatches[1])

		return id
	}

	return -1
}

func XlistID(s string) int {
	pattern, _ := regexp.Compile("/course/(.*)")

	submatches := pattern.FindStringSubmatch(s)

	if submatches != nil {
		id, _ := strconv.Atoi(submatches[1])

		return id
	}

	return -1
}

func XlistNode(s *goquery.Selection) *goquery.Selection {
	var els *goquery.Selection

	s.Each(func(i int, sel *goquery.Selection) {
		if strings.Contains(sel.Text(), strings.TrimSpace("Crosslisted")) {
			els = sel.Find("a")
		}
	})

	return els
}

func StripTitle(s string) string {
	pattern, _ := regexp.Compile(`^[^:]+\s*`)

	submatches := pattern.FindString(s)

	return submatches
}
