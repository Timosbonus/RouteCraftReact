import "./App.css";
import { useRef, useState, useEffect } from "react";
import Map from "./Components/Map";
import Navbar from "./Components/Navbar";

function App() {
  const adressInput = useRef(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Set the starting address and fetch its location only once
    const startPoint = "Ersigstraße 10a, 76275 Ettlingen";
    setNewAdress(startPoint); // Call the function to set the new address
  }); // Leeres Abhängigkeits-Array, damit es nur einmal aufgerufen wird

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

      <div>
        {locations.length ? (
          <Map locations={locations} />
        ) : (
          <p>Loading map...</p>
        )}
      </div>
    </div>
  );
}

export default App;
