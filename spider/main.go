package main

import (
	"os"

	"github.com/dali-lab/dplanner/spider/server"
)

var (
	port        = os.Getenv("PORT")
	layupURL    = os.Getenv("LAYUP_URL")
	layupCookie = os.Getenv("LAYUP_COOKIE")
	orcURL      = os.Getenv("ORC_URL")
)

func main() {
	server.Init(port, layupURL, layupCookie, orcURL)
}
