import React, { useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Map() {
  const [location, setLocation] = useState([48, 8]); // Default location Schöllbronn)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error);
  }, [success]);

  function success(position) {
    setLocation([position.coords.latitude, position.coords.longitude]);
    console.log(location);
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  return (
    <MapContainer center={location} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {<Marker position={location}>
        <Popup>Position: {location}</Popup>
      </Marker>}
    </MapContainer>
  );
}
