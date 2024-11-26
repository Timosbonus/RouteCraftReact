import "./MapAndLocationSelectionScreen.css";
import { useRef, useState, useEffect } from "react";

import Map from "./Map";
import Navbar from "./Navbar";
import LocationRoutesComp from "./LocationRoutesComp";
import {
  updateSaveDeleteLocations,
  getAllLocations,
  getAllDirections,
} from "./backendConfig";

function MapAndLocationSelectionScreen({
  routeInformation,
  handleSetRouteInformation,
}) {
  const adressInput = useRef(null);
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
            newLocation.breakDuration = routeInformation.defaultBreakDuration;
            newLocation.routeId = routeId;
            newLocation.current_index = locations.length; // adds new current index to sort later
            handleSetNewAdress(newLocation);
          }
        }
      })
      .catch((error) => console.error("Error fetching address:", error));
  }
  return (
    <div className="overview_container">
      <Navbar
        adressInput={adressInput}
        setNewAdress={setNewAdress}
        routeInformation={routeInformation}
      ></Navbar>

      <div className="map_locations_container">
        {locations.length ? (
          <>
            <Map
              locations={locations}
              directions={directions}
              setDirections={setDirections}
              routeInformation={routeInformation}
            />
            <LocationRoutesComp
              className="locations-routes-comp"
              locations={locations}
              directions={directions}
              setLocations={setLocations}
              handleSetRouteInformation={handleSetRouteInformation}
              routeInformation={routeInformation}
              setDirections={setDirections}
            />
          </>
        ) : (
          <p>Loading map...</p>
        )}
      </div>
    </div>
  );
}

export default MapAndLocationSelectionScreen;
