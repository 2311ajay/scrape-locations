from geopy.geocoders import Nominatim


geolocator = Nominatim(user_agent="name-of-your-user-agent")
location = geolocator.geocode("zus coffee")

print("Location =", location)