scrape:
	scrapy crawl zus_melaka -o store_locations.json 
clear_file:
	del "store_locations.json"
bulk_upload:
	python -u "c:\Users\ajayi\Documents\python\Django\WebScraper\ScrapeZusMelaka\bulkUploadToServer.py"

scrape_and_upload: clear_file scrape bulk_upload
