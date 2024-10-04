import "./App.css";
import { useRef, useState, useEffect } from "react";
import Map from "./Components/Map";
import Navbar from "./Components/Navbar";

function App() {
  const adressInput = useRef(null);
  const [locations, setLocations] = useState([]);

  function success(position) {
    const newLocation = [position.coords.latitude, position.coords.longitude];
    setLocations([newLocation]);
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "granted" || result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(success, error);
          } else if (result.state === "denied") {
            console.log("Geolocation access denied. Please enable location.");
          }
        })
        .catch(() => console.log("Error checking geolocation permission"));
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  function setNewAdress(event) {
    event.preventDefault();

    const inputValue = adressInput.current.value;

    fetch(
      `https://us1.locationiq.com/v1/search?key=${
        process.env.REACT_APP_LOCATIONIQ_KEY
      }&q=${encodeURIComponent(inputValue)}&format=json`
    )
      .then((response) => response.json())
      .then((json) => {
        if (json && json.length > 0) {
          const newLocation = [
            parseFloat(json[0].lat),
            parseFloat(json[0].lon),
          ];
          setLocations((prevLocations) => [...prevLocations, newLocation]);
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
