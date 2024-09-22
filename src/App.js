import "./App.css";
import { useRef, useState, useEffect } from "react";
import Map from "./Components/Map";

function App() {
  const adressInput = useRef(null); // Input reference
  const [location, setLocation] = useState([]); // Start with an empty array
  const [suggestions, setSuggestions] = useState([]); // empty array for suggestions
  const [debounceTimeout, setDebounceTimeout] = useState(null); // State for debounce timer

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
          setLocation([...location, newLocation]); // Adds the entered Location to the existing Locations
        }
      })
      .catch((error) => console.error("Error fetching address:", error));
  }

  // Function to handle the autocompletion feature
  function getAutocompletion() {
    const inputValue = adressInput.current.value;

    // Clear the previous debounce timer
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new debounce timer
    const newTimeout = setTimeout(() => {
      if (inputValue.length >= 3) {
        // Make the API call only if at least 3 characters are typed
        fetch(
          `https://api.locationiq.com/v1/autocomplete?key=${
            process.env.REACT_APP_LOCATIONIQ_KEY
          }&q=${encodeURIComponent(inputValue)}&limit=5&dedupe=1&`
        )
          .then((response) => response.json())
          .then((json) => {
            if (json && json.length > 0) {
              setSuggestions(json);
            }
          })
          .catch((error) => console.error("Error fetching address:", error));
      }
    }, 300); // Debounce delay of 300ms

    setDebounceTimeout(newTimeout); // Update the debounceTimeout state
  }

  return (
    <div className="App">
      <div>
        <input
          ref={adressInput}
          list="suggestions"
          placeholder="Enter an address"
          onChange={getAutocompletion}
        />
        {suggestions.length > 0 && (
          <datalist id="suggestions">
            {suggestions.map((sug, index) => (
              <option key={index} value={sug.display_name}>
                {sug.display_name}
              </option>
            ))}
          </datalist>
        )}
        <button onClick={setNewAdress}>Set Address</button>
      </div>

      {/* Conditionally render the map if the location is available */}
      {location.length ? <Map location={location} /> : <p>Loading map...</p>}
    </div>
  );
}

export default App;
