import { useEffect, useState } from "react";
import { Polyline } from "react-leaflet";

import polyline from "@mapbox/polyline"; // Import the polyline decoder

function DirectionsComponent({ locations }) {
  const [directions, setDirections] = useState([]); // Array to hold directions

  // gets the data between two locations and populates the directions array
  useEffect(() => {
    const len = locations.length;
    if (len > 1) {
      // Generate the waypoints string with the last two elements from the array
      const waypoints = locations
        .slice(-2)
        .map((loc) => `${loc[1]},${loc[0]}`) // Reverse [lat, lng] to [lng, lat]
        .join(";");

      // Fetch directions from LocationIQ API
      fetch(
        `https://us1.locationiq.com/v1/directions/driving/${waypoints}?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&steps=true&alternatives=true&geometries=polyline&overview=full`
      )
        .then((response) => response.json())
        .then((json) => {
          if (json && json.routes) {
            const decodedRoute = polyline
              .decode(json.routes[0].geometry)
              .map(([lat, lng]) => [lat, lng]);

            // Use functional update to ensure previous state is correctly updated
            setDirections((prevDirections) => [
              ...prevDirections,
              decodedRoute,
            ]);
          } else {
            console.error("No routes found");
          }
        })
        .catch((error) => console.error("Error fetching directions:", error));
    }
  }, [locations]); // Re-run when locations change

  return (
    <>
      {directions.map((route, index) => (
        <Polyline key={index} positions={route} color="red" />
      ))}
    </>
  );
}

export default DirectionsComponent;
