from django.http import JsonResponse
from scrapy.crawler import CrawlerProcess
from WebScraper.scrapers import HackerNewsSpider
from twisted.internet import reactor


def scrape_hacker_news(request):
    process = CrawlerProcess(settings={
        "FEEDS": {
            "items.json": {"format": "json"},
        },
    })
    process.crawl(HackerNewsSpider)
    deferred = process.join()
    deferred.addBoth(lambda _: reactor.stop())
    # process.start()
    reactor.run()
    with open("items.json", "r") as f:
        data = f.read()
    return JsonResponse(data, safe=False)