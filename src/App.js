import "./App.css";
import { useRef, useState, useEffect } from "react";
import Map from "./Components/Map";
import Navbar from "./Components/Navbar";
import LocationRoutesComp from "./Components/LocationRoutesComp";
import {
  updateSaveDeleteLocations,
  getAllLocations,
} from "./Components/backendConfig";

function App() {
  const adressInput = useRef(null);
  const [routeId, setRouteId] = useState("route123"); // routeId for database access
  const [locations, setLocations] = useState([]); // Array to hold locations
  const [directions, setDirections] = useState([]); // Array to hold directions
  const [defaultBreakDuration, setDefaultBreakDuration] = useState(20); // in minutes

  useEffect(() => {
    // useEffect to check the locations with specific routeId
    if (routeId) {
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
    }
  }, [routeId]);

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
            newLocation.breakDuration = defaultBreakDuration;
            newLocation.routeId = routeId;
            handleSetNewAdress(newLocation);
          }
        }
      })
      .catch((error) => console.error("Error fetching address:", error));
  }

  return (
    <div className="overview_container">
      <Navbar adressInput={adressInput} setNewAdress={setNewAdress}></Navbar>

      <div className="map_locations_container">
        {locations.length ? (
          <>
            <Map
              locations={locations}
              directions={directions}
              setDirections={setDirections}
            />
            <LocationRoutesComp
              className="locations-routes-comp"
              locations={locations}
              directions={directions}
              setLocations={setLocations}
              defaultBreakDuration={defaultBreakDuration}
              setDefaultBreakDuration={setDefaultBreakDuration}
            />
          </>
        ) : (
          <p>Loading map...</p>
        )}
      </div>
    </div>
  );
}

export default App;
