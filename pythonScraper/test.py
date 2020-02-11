from bs4 import BeautifulSoup
import html5lib

soup = BeautifulSoup("<p>Some<b>bad<i>HTML", "html5lib")
print(soup.prettify())