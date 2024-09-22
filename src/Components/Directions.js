import { useEffect, useState } from "react";

function DirectionsComponent({ locations }) {
  const [directions, setDirections] = useState([]); // Array to hold directions

  // gets the data between two locations and populates the directions array
  useEffect(() => {
    if (locations.length >= 2) {
      // Generate the waypoints string dynamically based on locations
      const waypoints = locations.map((loc) => loc.join(",")).join(";");
      console.log(waypoints);

      // Fetch directions from LocationIQ API
      fetch(
        `https://us1.locationiq.com/v1/directions/driving/${waypoints}?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&steps=true&alternatives=true&geometries=polyline&overview=full`
      )
        .then((response) => response.json())
        .then((json) => {
          if (json && json.routes) {
            setDirections([...directions, json.routes]); // Update the directions with the routes data
            console.log("Directions:", json.routes);
          } else {
            console.error("No routes found");
          }
        })
        .catch((error) => console.error("Error fetching directions:", error));
    }
  }, [locations]); // Re-run when locations change

  return (
    <div>
      <h2>Directions</h2>
      {directions.length > 0 ? (
        <ul>
          {directions.map((route, index) => (
            <li key={index}>
              Route {index + 1}: {route[0].legs[0].summary}
            </li>
          ))}
        </ul>
      ) : (
        <p>No directions available.</p>
      )}
    </div>
  );
}

export default DirectionsComponent;
