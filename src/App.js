import "./App.css";
import { useRef, useState, useEffect } from "react";
import Map from "./Components/Map";

function App() {
  const adressInput = useRef(null); // Input reference
  const [location, setLocation] = useState([]); // Start with an empty array

  // Geolocation success and error handlers
  function success(position) {
    const newLocation = [position.coords.latitude, position.coords.longitude];
    setLocation([newLocation]); // Replace the location with new coordinates
    console.log("User's location:", newLocation);
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  // useEffect for Geolocation
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
  }, []); // Empty dependency array, run only on component mount

  // Function to handle new address input and make API call
  function setNewAdress() {
    const inputValue = adressInput.current.value; // Access the input value

    fetch(
      // fetching the api for geocoding the adress to coods
      `https://us1.locationiq.com/v1/search?key=pk.59909c833b95a185032a1981fe1619ae&q=${encodeURIComponent(
        inputValue
      )}&format=json`
    )
      .then((response) => response.json())
      .then((json) => {
        if (json && json.length > 0) {
          const newLocation = [
            parseFloat(json[0].lat),
            parseFloat(json[0].lon),
          ];
          setLocation([...location, newLocation]); // Adds the entered Location to the existing Locations
        }
      })
      .catch((error) => console.error("Error fetching address:", error));
  }

  return (
    <div className="App">
      <div>
        <input ref={adressInput} placeholder="Enter an address" />
        <button onClick={setNewAdress}>Set Address</button>
      </div>

      {/* Conditionally render the map if the location is available */}
      {location.length ? <Map location={location} /> : <p>Loading map...</p>}
    </div>
  );
}

export default App;
