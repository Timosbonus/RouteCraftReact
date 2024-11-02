import { useEffect } from "react";
import { Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline"; // Import the polyline decoder

function DirectionsComponent({ locations, directions, setDirections }) {
  useEffect(() => {
    const len = locations.length;
    const fetchedRoutes = new Map(); // Store fetched route ids

    // Populate the Map with already fetched route locationConnection (waypoints)
    directions.forEach((direction) => {
      fetchedRoutes.set(direction.locationConnection, direction); // Add waypoints as key and direction object as value
    });

    if (len > 1) {
      const fetchAllDirectionsWithDelay = async () => {
        let newDirections = []; // Store the new directions

        for (let i = 0; i < locations.length - 1; i++) {
          const waypoints = `${locations[i].lon},${locations[i].lat};${
            locations[i + 1].lon
          },${locations[i + 1].lat}`;

          // Check if the route has already been fetched synchronously and add it to directions
          if (fetchedRoutes.has(waypoints)) {
            newDirections.push(fetchedRoutes.get(waypoints));
            continue; // Skip API call
          }

          // Perform the asynchronous fetch call only when necessary
          try {
            const response = await fetch(
              `https://us1.locationiq.com/v1/directions/driving/${waypoints}?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&steps=true&alternatives=true&geometries=polyline&overview=full`
            );
            const json = await response.json();

            if (json && json.routes) {
              json.locationConnection = waypoints; // Add a unique locationConnection to the json object based on the waypoints
              json.geometry = json.routes[0].geometry;

              console.log(json);

              newDirections.push(json); // Add the new directions to the array
              fetchedRoutes.set(waypoints, json); // Add the waypoints to the map to avoid future duplicate fetches
            }

            // Add a delay of 510ms (2 requests per second) / max free tier from the api
            if (i < locations.length - 2) {
              await new Promise((resolve) => setTimeout(resolve, 510));
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
            .decode(route.geometry)
            .map(([lat, lng]) => [lat, lng])}
          pathOptions={{ color: "blue", weight: 5, opacity: 0.7 }}
        />
      ))}
    </>
  );
}

export default DirectionsComponent;
