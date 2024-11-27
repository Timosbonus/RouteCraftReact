import "./App.css";
import { useState, useEffect } from "react";
import MapAndLocationSelectionScreen from "./Components/MapView/MapAndLocationSelectionScreen";
import RouteOverviewComponent from "./Components/RoutesView/RouteOverviewComponent";
import {
  updateSelectedRoute,
  updateSaveDeleteLocations,
  getAllLocations,
  getAllDirections,
} from "./Components/etc/backendConfig";

function App() {
  const [routeInformation, setRouteInformation] = useState(false); // routeId for database access
  const [locations, setLocations] = useState([]); // Array to hold locations
  const [directions, setDirections] = useState([]); // Array to hold directions

  const routeId = routeInformation.routeId;

  useEffect(() => {
    // useEffect to check the locations with specific routeId
    if (routeInformation) {
      getAllLocations(routeId)
        .then((newLocations) => {
          if (newLocations.length === 0) {
            // if there are no locations, sets start point
            const startPoint = "Ersigstraße 10a, 76275 Ettlingen";
            setNewAdress(startPoint);
          }
          setLocations(newLocations);
        })
        .catch((error) => {
          console.error("Error loading locations: ", error);
        });

      // calls the same api to get all the direction data
      getAllDirections(routeId).then((newDirections) => {
        setDirections(newDirections);
      });
    }
  }, [routeInformation]);

  // function which accepts a new location updates the location array and sends and receives data from backend, ALWAYS CALL setNewAdress!
  function handleSetNewAdress(newLocation) {
    const updatedLocations = [...locations, newLocation];

    updateSaveDeleteLocations(updatedLocations, routeId) // axios method to get data from Backend
      .then((newLocations) => {
        setLocations(newLocations); // Takes data from api to set array
      })
      .catch((error) => {
        console.error("Error updating locations: ", error);
      });
  }

  // function to get the adress data from api and calls the handleSetNewAdress function with the newly received data
  function setNewAdress(inputValue) {
    fetch(
      `https://us1.locationiq.com/v1/search?key=${
        process.env.REACT_APP_LOCATIONIQ_KEY
      }&q=${encodeURIComponent(inputValue)}&format=json`
    )
      .then((response) => response.json())
      .then((json) => {
        // json response added to the location array (object)
        if (json && json.length > 0) {
          const newLocation = json[0];

          // check if position already exists
          const exists = locations.some((loc) => loc.lon === newLocation.lon);

          if (!exists) {
            // sets json data for breakDuration and the routeId
            newLocation.breakDuration = routeInformation.defaultBreakDuration;
            newLocation.routeId = routeId;
            newLocation.current_index = locations.length; // adds new current index to sort later
            handleSetNewAdress(newLocation);
          }
        }
      })
      .catch((error) => console.error("Error fetching address:", error));
  }

  function handleSetRouteInformation(input) {
    updateSelectedRoute(input)
      .then((newRoute) => {
        setRouteInformation(newRoute);
      })
      .catch((error) => {
        console.error("Error updating Route: ", error);
      });
  }

  let curView = (
    <RouteOverviewComponent
      routeInformation={routeInformation}
      setRouteInformation={handleSetRouteInformation}
    ></RouteOverviewComponent>
  );
  if (routeInformation) {
    curView = (
      <MapAndLocationSelectionScreen
        routeInformation={routeInformation}
        handleSetRouteInformation={handleSetRouteInformation}
        locations={locations}
        directions={directions}
        setLocations={setLocations}
        setDirections={setDirections}
        setNewAdress={setNewAdress}
      ></MapAndLocationSelectionScreen>
    );
  }

  return <>{curView}</>;
}

export default App;
