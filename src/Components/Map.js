import React, { useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

// Custom component to update map center
function ChangeMapView({ coords }) {
  const map = useMap();
  map.setView(coords, map.getZoom()); // Updates the map view to the new coordinates
}

export default function Map() {
  const [location, setLocation] = useState(null); // Start with null to delay map rendering

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error); // navigator needs sucess and error function and gives position to sucess func
  }, []);

  function success(position) {
    const newLocation = [position.coords.latitude, position.coords.longitude];
    setLocation(newLocation);
    console.log(location);
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  if (!location) {
    return <div>Loading map...</div>; // Show a loading state before the location is found
  }

  return (
    <MapContainer center={location} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {location && <ChangeMapView coords={location} />}
      {location && (
        <Marker position={location}>
          <Popup>Position: {location.join(", ")}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
