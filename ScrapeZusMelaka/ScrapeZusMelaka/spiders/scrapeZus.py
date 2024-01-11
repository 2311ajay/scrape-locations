import scrapy
from geopy.geocoders import Nominatim


class HackerNewsSpider(scrapy.Spider):
    name = "hacker_news"
    start_urls = [
        "https://quotes.toscrape.com"
    ]
    def parse(self, response):
        for article in response.css("div.quote"):
            yield {
                "text": article.css("span.text::text").get(),
                "tags" : article.css("div.tags a.tag::text").getall(),
                "author" : article.css("small.author::text").get()
            }
        next_page = response.css("li.next a::attr(href)").get() # check if there is a next
        if next_page is not None:
            yield response.follow(next_page, self.parse)

class HackerNewsSpider(scrapy.Spider):
    geolocator = Nominatim(user_agent="nominatim-is-cool")
    name = "zus_melaka"
    start_urls = [
        "https://zuscoffee.com/category/store/melaka/"
    ]
    def parse(self, response):
        # for article in response.css("span.entry-title::text"):
        for store_widget in response.css("div.elementor-row div div div.elementor-widget-wrap"):

            store_name = store_widget.css("div div div span.entry-title::text")  
            store_address = store_widget.css("div div p::text") 

            if store_name and store_address and store_name != store_address:      
                yield {
                    "name": store_name.get(),
                    "address": store_address.get()
                    # "location": article.get(),
                    # "tags" : article.css("div.tags a.tag::text").getall(),
                    # "author" : article.css("small.author::text").get()
                }
            continue
        next_page = response.css("nav.elementor-pagination a::attr(href)").get() # check if there is a next
        if next_page is not None and next_page not in HackerNewsSpider.start_urls:
            print("next =", next_page, HackerNewsSpider.start_urls)
            yield response.follow(next_page, self.parse)



            # <a class="page-numbers next" href="https://zuscoffee.com/category/store/melaka/page/2/">Next</a>

# response.css("<HTML element>.<its class> <CHILD HTML ELEMENT>::attr(href)")