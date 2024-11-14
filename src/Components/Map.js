import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

import DirectionsComponent from "./DirectionsComponent";

// Component to change the position of the map
function ChangeMapView({ coords }) {
  const map = useMap(); // Access the map instance
  useEffect(() => {
    map.setView(coords, 13); // Update map view to new coordinates
  }, [coords, map]);
  return null;
}

export default function Map({ locations, directions, setDirections, routeId }) {
  // custom Icon Styling
  const customIcon = new L.Icon({
    iconUrl: `${process.env.PUBLIC_URL}/assets/location.png`,
    iconSize: [40, 40],
    iconAnchor: [20, 30],
    popupAnchor: [0, 0],
  });

  // Renders all items in the location List with Popups
  const locationList = locations.map((current, index) => (
    <Marker position={[current.lat, current.lon]} key={index} icon={customIcon}>
      <Popup>{current.display_name}</Popup>
    </Marker>
  ));

  return (
    <MapContainer
      center={locations[0]} // Center on the last location
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <DirectionsComponent
        locations={locations}
        directions={directions}
        setDirections={setDirections}
        routeId={routeId}
      ></DirectionsComponent>

      <ChangeMapView
        coords={[
          locations[locations.length - 1].lat,
          locations[locations.length - 1].lon,
        ]}
      />
      {/* ChangeMapView updates to the newest point */}
      {locationList}
    </MapContainer>
  );
}
