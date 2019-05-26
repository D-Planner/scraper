package stringutil

import "strings"

func Trim(s string) string    { return strings.Replace(s, " ", "", -1) }
func Split(s string) []string { return strings.Split(Trim(s), ",") }
