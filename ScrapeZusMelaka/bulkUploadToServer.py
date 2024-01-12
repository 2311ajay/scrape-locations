"""
Script for processing store locations and posting geolocation data to a RESTful API.

This script reads store locations from a JSON file, extracts relevant information,
and utilizes the Nominatim geocoding service to obtain geolocation data. The obtained
data is then sent to a specified API endpoint.

Note: Make sure to replace 'name-of-your-user-agent' in the Nominatim initialization
with an appropriate user agent.

"""

import json
import requests
from geopy.geocoders import Nominatim
import time
import re

# Initialize Nominatim geocoder with a custom user agent
geolocator = Nominatim(user_agent="name-of-your-user-agent")

# API endpoint for storing geolocation data
url = 'http://127.0.0.1:8000/api/tasks/'

def containsPostcode(address: str):
    """
    Check if the given address string contains a postcode.

    Parameters
    ----------
    address : str
        The address string to check.

    Returns
    -------
    bool
        True if the address contains a postcode, False otherwise.

    """
    regexp = re.compile(r'[0-9][0-9][0-9][0-9][0-9]')
    return bool(regexp.search(address))

# Read store locations from the JSON file
with open("store_locations.json") as f:
    store_locations = json.load(f)

    # Process each store location
    for loc in store_locations:
        payload = {}
        payload["store_name"] = loc["name"]
        payload["store_location"] = loc["address"]

        # Split address into components
        address_breakdown = payload["store_location"].split(",")

        # Skip locations with insufficient address components
        if len(address_breakdown) < 4:
            continue

        print("address =", address_breakdown)

        # Find the index of the component containing the postcode
        i = 0
        for i, a in enumerate(address_breakdown):
            if containsPostcode(a):
                i = i
                break

        # Ensure the index does not exceed the array bounds
        address_breakdown.append("")
        searchString = address_breakdown[i] + address_breakdown[i + 1]
        print("searchString =", searchString)

        # Perform geocoding using Nominatim
        search_address = geolocator.geocode(searchString)
        time.sleep(2.5)
        print(search_address)
        location = search_address[-1]
        print("location =", location)
        print("--------------------------------------------------------------------------")

        # Update payload with geolocation data and send a POST request to the API
        payload["store_geolocation"] = str(location)
        x = requests.post(url, json=payload)