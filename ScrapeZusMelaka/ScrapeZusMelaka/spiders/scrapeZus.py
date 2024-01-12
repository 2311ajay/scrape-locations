"""
Scrapy Spider for scraping information from a website containing store details.

This script defines a Scrapy Spider named "zus_melaka" designed to scrape information
from the website "https://zuscoffee.com/category/store/melaka/".

It extracts store names and addresses from the specified website, filtering out cases
where the store name matches the store address. The extracted data is then yielded as
Python dictionaries.

Note: Make sure to replace 'nominatim-is-cool' in the Nominatim initialization with an
appropriate user agent.

"""

import scrapy
from geopy.geocoders import Nominatim

class ZusMelakaSpider(scrapy.Spider):
    """
    Scrapy Spider for scraping Zus Coffee store information in Melaka.
    """
    # Initialize Nominatim geocoder with a custom user agent
    geolocator = Nominatim(user_agent="nominatim-is-cool")

    name = "zus_melaka"

    # The starting URL for the spider
    start_urls = [
        "https://zuscoffee.com/category/store/melaka/"
    ]

    def parse(self, response):
        """
        Parse the response from the website and extract store information.

        Parameters
        ----------
        response : scrapy.http.Response
            The response received from making a request to the specified URL.

        Yields
        ------
        dict
            A dictionary containing the extracted store information.

        """
        # Iterate through each store widget on the page
        for store_widget in response.css("div.elementor-row div div div.elementor-widget-wrap"):
            store_name = store_widget.css("div div div span.entry-title::text").get()
            store_address = store_widget.css("div div p::text").get()

            # Check if store_name, store_address are not None and not equal
            if store_name and store_address and store_name != store_address:
                yield {
                    "name": store_name,
                    "address": store_address,
                }

        # Check if there is a next page and follow the link if present
        next_page = response.css("nav.elementor-pagination a::attr(href)").get()
        if next_page is not None and next_page not in ZusMelakaSpider.start_urls:
            print("next =", next_page, ZusMelakaSpider.start_urls)
            yield response.follow(next_page, self.parse)