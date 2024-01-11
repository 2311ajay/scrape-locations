import json 
import requests
from geopy.geocoders import Nominatim
import time
import re


geolocator = Nominatim(user_agent="name-of-your-user-agent")
url = 'http://127.0.0.1:8000/api/tasks/'

def containsPostcode(address: str):
    regexp = re.compile(r'[0-9][0-9][0-9][0-9][0-9]')
    return bool(regexp.search(address))

with open("store_locations.json") as f:
    store_locations = json.load(f)

    for loc in store_locations:
        payload = {}
        payload["store_name"] = loc["name"]
        payload["store_location"] = loc["address"]
        address_breakdown = payload["store_location"].split(",")
        if len(address_breakdown) < 4:
            continue
        print("address =", address_breakdown)
        i = 0
        for i, a in enumerate(address_breakdown):
            if containsPostcode(a):
                i = i
                break
        address_breakdown.append("")
        searchString = address_breakdown[i] + address_breakdown[i + 1]
        print("searchString =", searchString)
        search_address = geolocator.geocode(searchString)
        time.sleep(2.5)
        print(search_address)
        location = search_address[-1]
        print("location =", location)
        print("--------------------------------------------------------------------------")
        payload["store_geolocation"] = str(location)
        x = requests.post(url, json = payload)


