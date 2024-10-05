import "./App.css";
import { useRef, useState, useEffect } from "react";
import Map from "./Components/Map";
import Navbar from "./Components/Navbar";
import LocationRoutesComp from "./Components/LocationRoutesComp";

function App() {
  const adressInput = useRef(null);
  const [locations, setLocations] = useState([]);
  const [directions, setDirections] = useState([]); // Array to hold directions

  // Set the starting address and fetch its location only once
  useEffect(() => {
    const startPoint = "Ersigstraße 10a, 76275 Ettlingen";
    setNewAdress(startPoint); // Call the function to set the new address
    // eslint-disable-next-line
  }, []);

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

          // Überprüfen, ob die neue Position bereits existiert
          const exists = locations.some((loc) => loc.lon === newLocation.lon);

          if (!exists) {
            setLocations((prevLocations) => [...prevLocations, newLocation]);
          }
        }
      })
      .catch((error) => console.error("Error fetching address:", error));
  }

  return (
    <div className="App">
      <Navbar adressInput={adressInput} setNewAdress={setNewAdress}></Navbar>

      <div className="map-view-container">
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
