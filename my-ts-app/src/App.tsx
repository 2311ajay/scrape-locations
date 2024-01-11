import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Circle, MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import IconPng from "./images/pin.png";


interface StoreLocation {
  store_name: String;
  store_location: String;
  store_geolocation: [number, number]; //[lat, long]
  id: number;
  created_at: String,
}

const degToRad = (deg: number): number => {
  return deg * (Math.PI / 180.0);
};

const distanceBetweenStores = (s1: StoreLocation, s2: StoreLocation) => {
    const d = Math.acos(
                        (Math.sin(degToRad(s1.store_geolocation[0])) * Math.sin(degToRad(s2.store_geolocation[0]))) + 
                        (Math.cos(degToRad(s1.store_geolocation[0])) * Math.cos(degToRad(s2.store_geolocation[0]))) 
                        
                        * (Math.cos(degToRad(s2.store_geolocation[1]) - degToRad(s1.store_geolocation[1])))) * 6371

    return d;
}

function App() {
  const center: [number, number] = [ 2.200844, 102.240143]
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>([])

  const myIcon = L.icon({
  iconUrl: IconPng,
  iconSize: [35, 43],
  iconAnchor: [18, 26]
});
  
  const mapRef = useRef();
  const RADIUS_OF_NETWORK = 4000;
  const limeOptions = { color: 'lime' }
  const greyOptions = { color: 'grey' }

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tasks/')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("scraped data =", data);
        const processedData = data.map((d: { store_geolocation: any; }) => {
          let geoLoc = d.store_geolocation;
          geoLoc = geoLoc.replace("(", "");
          geoLoc = geoLoc.replace(")", "");
          const latLong = geoLoc.split(",");
          const position: [number, number] = [latLong[0], latLong[1]];
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
    // @ts-ignore
    <div className='App'>
      {/* @ts-ignore */}
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} ref={mapRef}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {storeLocations.map(storeLocation => {
          let geoLoc = storeLocation.store_geolocation;
          const position: [number, number] = [geoLoc[0], geoLoc[1]];
          let withinANetwork = false;
          storeLocations.forEach(element => {
            if (distanceBetweenStores(element, storeLocation) <= 5 && element.id !== storeLocation.id ) {
              withinANetwork = true
            }
          });

          return (
            <>
              <Marker position={position} icon={myIcon} />
              <Circle radius={RADIUS_OF_NETWORK} center={position} pathOptions={withinANetwork? limeOptions: greyOptions}>
                <Tooltip sticky>{storeLocation.store_name}</Tooltip>
              </Circle>
            </>
          )})}
      </MapContainer>
    </div>
  );
}

export default App;
