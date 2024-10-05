import { useEffect } from "react";
import { Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline"; // Import the polyline decoder

function DirectionsComponent({ locations, directions, setDirections }) {
  useEffect(() => {
    const len = locations.length;
    if (len > 1) {
      // Get the last two distinct locations
      const uniqueLocations = [
        ...new Set(locations.map((loc) => `${loc.lon},${loc.lat}`)),
      ];
      const lastTwoLocations = uniqueLocations.slice(-2);

      // Check if we have at least two unique locations to create waypoints
      if (lastTwoLocations.length === 2) {
        const waypoints = lastTwoLocations.join(";"); // Create waypoints string

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
              console.log(decodedRoute);
            } else {
              console.error("No routes found");
            }
          })
          .catch((error) => console.error("Error fetching directions:", error));
      }
    }
    // eslint-disable-next-line
  }, [locations]); // Re-run when locations change

  return (
    <>
      {directions.map((route, index) => (
        <Polyline
          key={index}
          positions={route}
          pathOptions={{ color: "blue", weight: 5, opacity: 0.7 }}
        />
      ))}
    </>
  );
}

export default DirectionsComponent;
