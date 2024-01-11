import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Circle, CircleMarker, MapContainer, Marker, Polygon, Polyline, Popup, Rectangle, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import IconPng from "./images/pin.png";
import { idText } from 'typescript';

interface StoreLocation {
  store_name: String;
  store_location: String;
  store_geolocation: String;
  id: number;
  created_at: String,
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
  const POINT_SIZE = 10;
  const RADIUS_OF_NETWORK = 5000;
  const [pointRadius, setPointRadius] = useState(POINT_SIZE);
  const [boundaryRadius, setBoundaryRadius] = useState(POINT_SIZE);
  const fillBlueOptions = { fillColor: 'blue' }
  const blackOptions = { color: 'black' }
  const limeOptions = { color: 'lime' }
  const purpleOptions = { color: 'purple' }
  const redOptions = { color: 'red' }

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tasks/')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("scraped data =", data);
        setStoreLocations(data);
      })
      .catch(
        e => console.log("error =", e)
      );
  }, []);

  return (
    // @ts-ignore
    <MapContainer center={[2.200844, 102.240143]} zoom={13} scrollWheelZoom={false} ref={mapRef}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Marker position={center} icon={myIcon} />
      <Circle radius={RADIUS_OF_NETWORK} center={center} /> */}
      {storeLocations.map(storeLocation => {
        let geoLoc = storeLocation.store_geolocation;
        geoLoc = geoLoc.replace("(", "");
        geoLoc = geoLoc.replace(")", "");
        const latLong = geoLoc.split(",");
        const position: [number, number] = [+latLong[0], +latLong[1]];
        const inNetwork = true;
        return (
          <>
            <Marker position={position} icon={myIcon} />
            <Circle radius={RADIUS_OF_NETWORK} center={position} pathOptions={inNetwork? limeOptions: redOptions}/>
          </>
        )})}
        {/* <Polyline pathOptions={limeOptions} positions={polyline} />
        <Polyline pathOptions={limeOptions} positions={multiPolyline} />
        <Polygon pathOptions={purpleOptions} positions={polygon} />
        <Polygon pathOptions={purpleOptions} positions={multiPolygon} />
        <Rectangle bounds={rectangle} pathOptions={blackOptions} /> */}
    </MapContainer>
  );
}

export default App;

// import L from "leaflet";
// import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
// import { useState, useRef, useEffect } from "react";
// import IconPng from "./images/pin.png";

// const myIcon = L.icon({
//   iconUrl: IconPng,
//   iconSize: [35, 43],
//   iconAnchor: [18, 26]
// });

// const center = {
//   lat: 51.505,
//   lng: -0.09
// };

// function DroppableMarker({ pos, radius }: {pos: [number, number], radius: number}) {
//   return (
//     <>
//       <Marker position={pos} icon={myIcon} />
//       <Circle radius={radius} center={pos} />
//     </>
//   );
// }

// export default function App() {
//   const mapRef = useRef();
//   const [position, setPosition] = useState(null);
//   const [radius, setRadius] = useState(1000);

//   // @ts-ignore
//   const addMarker = (e) => {

//     setPosition([e.latlng.lat, e.latlng.lng]);

//     setRadius(1000);
    
//     console.log("zoom", mapRef.current.leafletElement.getZoom());
//   };

//   return (
//     // @ts-ignore
//     <MapContainer center={center} zoom={13} tap={false} onClick={addMarker} ref={mapRef}>
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {position ? <DroppableMarker pos={position} radius={radius} /> : null}
//     </MapContainer>
//   );
// }