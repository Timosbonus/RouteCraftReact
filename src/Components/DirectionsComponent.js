import { useEffect } from "react";
import { Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline";
import { updateSaveDeleteDirections } from "./backendConfig";

function DirectionsComponent({
  locations,
  directions,
  setDirections,
  routeInformation,
}) {
  console.log(routeInformation);
  const routeId = routeInformation ? routeInformation.routeId : "";


  useEffect(() => {
    const len = locations.length;
    const fetchedRoutes = new Map();

    directions.forEach((direction) => {
      fetchedRoutes.set(direction.locationConnection, direction);
    });

    // more than one location, otherwise no direction possible
    if (len > 1) {
      let newDirections = [];
      const fetchAllDirectionsWithRetry = async () => {
        // function to try more than one fetch trys to not fail
        const fetchWithRetry = async (url, retries = 3, delay = 500) => {
          for (let attempt = 1; attempt <= retries; attempt++) {
            try {
              const response = await fetch(url);
              if (!response.ok) throw new Error("Network response was not ok");
              const json = await response.json();
              return json;
            } catch (error) {
              if (attempt === retries) {
                console.error(`Final attempt failed for URL: ${url}`);
                throw error;
              }
              console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms`);
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          }
        };

        // checking every existing direction to not have to make api call
        for (let i = 0; i < locations.length - 1; i++) {
          const waypoints = `${locations[i].lon},${locations[i].lat};${
            locations[i + 1].lon
          },${locations[i + 1].lat}`;

          // if alread existing, continue loop and not fetching
          if (fetchedRoutes.has(waypoints)) {
            let existingDirection = fetchedRoutes.get(waypoints);
            existingDirection.currentIndex = i;
            newDirections.push(existingDirection);
            continue;
          }

          try {
            const url = `https://us1.locationiq.com/v1/directions/driving/${waypoints}?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&steps=true&alternatives=true&geometries=polyline&overview=full`;
            const json = await fetchWithRetry(url, 3, 1000);

            if (json && json.routes) {
              // adding properties to send to the backend and use in frontend
              json.locationConnection = waypoints;
              json.geometry = json.routes[0].geometry;
              json.routeId = routeId;
              json.currentIndex = i;
              json.duration = json.routes[0].duration;
              json.distance = json.routes[0].distance;

              newDirections.push(json);
              fetchedRoutes.set(waypoints, json);
            }

            if (i < locations.length - 2) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          } catch (error) {
            console.error("Error fetching directions for", waypoints, error);
          }
        }
        // backend call to check with saved directions
        updateSaveDeleteDirections(newDirections, routeId).then(
          (fetchedDirections) => {
            setDirections(fetchedDirections);
          }
        );
      };

      fetchAllDirectionsWithRetry();
      // else to delete also the last direction, otherwise it doesnt delete. Sende empty array to backend
      // to set directions array and backend empty
    } else {
      updateSaveDeleteDirections([], routeId).then((fetchedRoutes) => {
        setDirections(fetchedRoutes);
      });
    }
  }, [locations]);

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
