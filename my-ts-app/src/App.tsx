// Importing necessary modules and styles
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Circle, MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import IconPng from "./images/pin.png";

// Define the structure of a StoreLocation object
interface StoreLocation {
  store_name: String;
  store_location: String;
  store_geolocation: [number, number]; //[lat, long]
  id: number;
  created_at: String,
}

// Function to convert degrees to radians
const degToRad = (deg: number): number => {
  return deg * (Math.PI / 180.0);
};

// Function to calculate the great-circle distance between two store locations
const distanceBetweenStores = (s1: StoreLocation, s2: StoreLocation) => {
    const d = Math.acos(
                        (Math.sin(degToRad(s1.store_geolocation[0])) * Math.sin(degToRad(s2.store_geolocation[0]))) + 
                        (Math.cos(degToRad(s1.store_geolocation[0])) * Math.cos(degToRad(s2.store_geolocation[0]))) 
                        
                        * (Math.cos(degToRad(s2.store_geolocation[1]) - degToRad(s1.store_geolocation[1])))) * 6371

    return d;
}

function App() {
  // Initial center coordinates of the map
  const center: [number, number] = [2.200844, 102.240143];

  // State to store the fetched store locations
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>([])

  // Custom Leaflet icon for markers
  const myIcon = L.icon({
    iconUrl: IconPng,
    iconSize: [35, 43],
    iconAnchor: [18, 26]
  });

  // Ref to access the Leaflet map instance
  const mapRef = useRef();

  // Radius of the network for circles on the map
  const RADIUS_OF_NETWORK = 4000;

  // Options for circle colors
  const limeOptions = { color: 'lime' }
  const greyOptions = { color: 'grey' }

  // Fetch store locations from the API on component mount
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tasks/')
      .then((res) => res.json())
      .then((data) => {
        // Process fetched data to convert store_geolocation string to [lat, long] array
        const processedData = data.map((d: { store_geolocation: any; }) => {
          let geoLoc = d.store_geolocation;
          geoLoc = geoLoc.replace("(", "");
          geoLoc = geoLoc.replace(")", "");
          const latLong = geoLoc.split(",");
          const position: [number, number] = [parseFloat(latLong[0]), parseFloat(latLong[1])];
          return {
            ...d,
            store_geolocation: position
          }
        })
        setStoreLocations(processedData);
      })
      .catch(
        e => console.log("error =", e)
      );
  }, []);

  return (
    // Main App component rendering the map
    <div className='App'>
      {/* Leaflet Map Container */}
      {/* @ts-ignore */}
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} ref={mapRef}>
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Map markers and circles for each store location */}
        {storeLocations.map(storeLocation => {
          let geoLoc = storeLocation.store_geolocation;
          const position: [number, number] = [geoLoc[0], geoLoc[1]];
          let withinANetwork = false;
          // Check if the store is within the network by comparing distances with other stores
          storeLocations.forEach(element => {
            if (distanceBetweenStores(element, storeLocation) <= 5 && element.id !== storeLocation.id ) {
              withinANetwork = true
            }
          });

          return (
            // Fragments for rendering Marker and Circle for each store location
            <>
              <Marker position={position} icon={myIcon} />
              <Circle radius={RADIUS_OF_NETWORK} center={position} pathOptions={withinANetwork? limeOptions: greyOptions}>
                <Tooltip sticky>{storeLocation.store_name}</Tooltip>
              </Circle>
            </>
          )
        })}
      </MapContainer>
    </div>
  );
}

// Export the App component
export default App;
