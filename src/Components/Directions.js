import { useEffect } from "react";
import { Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline"; // Import the polyline decoder

function DirectionsComponent({ locations, directions, setDirections }) {
  useEffect(() => {
    const len = locations.length;

    if (len > 1) {
      // Fetch directions for every consecutive pair of locations with rate limiting
      const fetchAllDirectionsWithDelay = async () => {
        const uniqueLocations = [
          ...new Set(locations.map((loc) => `${loc.lon},${loc.lat}`)),
        ];

        let newDirections = []; // Store the new directions

        for (let i = 0; i < uniqueLocations.length - 1; i++) {
          const waypoints = `${uniqueLocations[i]};${uniqueLocations[i + 1]}`;

          try {
            const response = await fetch(
              `https://us1.locationiq.com/v1/directions/driving/${waypoints}?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&steps=true&alternatives=true&geometries=polyline&overview=full`
            );
            const json = await response.json();

            if (json && json.routes) {
              newDirections.push(json); // Add the new directions to the array
            } else {
              console.error("No routes found for", waypoints);
            }

            // Add a delay of 500ms (2 requests per second)
            if (i < uniqueLocations.length - 2) {
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          } catch (error) {
            console.error("Error fetching directions for", waypoints, error);
          }
        }

        // Once all directions are fetched, update the state
        setDirections(newDirections);
      };

      fetchAllDirectionsWithDelay(); // Call the function to fetch all directions with delay
    }
    // eslint-disable-next-line
  }, [locations]); // Re-run when locations change

  return (
    <>
      {directions.map((route, index) => (
        <Polyline
          key={index}
          positions={polyline
            .decode(route.routes[0].geometry)
            .map(([lat, lng]) => [lat, lng])}
          pathOptions={{ color: "blue", weight: 5, opacity: 0.7 }}
        />
      ))}
    </>
  );
}

export default DirectionsComponent;
