import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";

// Component to change the position of the map
function ChangeMapView({ coords }) {
  const map = useMap(); // Access the map instance
  useEffect(() => {
    map.setView(coords, 13); // Update map view to new coordinates
  }, [coords, map]);
  return null;
}

export default function Map({ location }) {
  // Renders all items in the location List with Popups
  const locationList = location.map((place, index) => (
    <Marker position={place} key={index}>
      <Popup>Position: {place.join(", ")}</Popup>
    </Marker>
  ));

  return (
    <MapContainer
      center={location[0]} // Center on the last location
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeMapView coords={location[location.length - 1]} />
      {/* ChangeMapView updates to the newest point */}
      {locationList}
    </MapContainer>
  );
}
