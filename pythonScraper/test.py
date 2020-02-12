from bs4 import BeautifulSoup
import json
import requests
import urllib3
import html5lib

ORC_URL = ""
TIMETABLE_URL = ""

LAYUP_URL = 'https://www.layuplist.com'
LAYUP_TOKEN = "xv8lzj3ujdhksuhwbutnnrvb1h789ar9"

headers={
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.5",
  "Cache-Control": "max-age=0",
  "Cookie": "__cfduid=debe08e2f1686a02274484243516058e51580397097;csrftoken=Pg4KK9cE57fm9WlMncRtkVTGFfqJiG9kXAPeYIywDpGQPvb9Qj8Hu6ip8sV6k5oA;sessionid=xv8lzj3ujdhksuhwbutnnrvb1h789ar9",
  # "Connection": "keep-alive",
  "Connection": "close",
  "DNT": "1",
  "Host": "www.layuplist.com",
  "TE": "Trailers",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0"
}

cookies = dict(__cfduid="debe08e2f1686a02274484243516058e51580397097", csrftoken="Pg4KK9cE57fm9WlMncRtkVTGFfqJiG9kXAPeYIywDpGQPvb9Qj8Hu6ip8sV6k5oA", sessionid="xv8lzj3ujdhksuhwbutnnrvb1h789ar9")

# r = requests.get(LAYUP_URL, headers=headers, cookies=cookies)
# r.encoding = 'utf-8'

http = urllib3.PoolManager()
r = http.request(
    'GET',
    'https://d-planner.com'
)

print("request complete")
# soup = BeautifulSoup(r.content, "html5lib")
soup = BeautifulSoup(r.data, "html5lib")
# soup = json.loads(r.data.decode('utf-8'))['headers']
print(soup.find('div', {'class': "welcome-text"}))
print(soup.prettify())

