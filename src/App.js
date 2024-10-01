import "./App.css";
import { useRef, useState, useEffect } from "react";
import Map from "./Components/Map";

function App() {
  const adressInput = useRef(null); // Input reference
  const [locations, setLocations] = useState([]); // Start with an empty array
  const [suggestions, setSuggestions] = useState([]); // empty array for suggestions
  const [debounceTimeout, setDebounceTimeout] = useState(null); // State for debounce timer

  // Geolocation success and error handlers
  function success(position) {
    const newLocation = [position.coords.latitude, position.coords.longitude];
    setLocations([newLocation]); // Replace the location with new coordinates
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
  function setNewAdress(event) {
    // event automatically inserted, prevents Map to rerender when SetAdress Button is pressed
    event.preventDefault();

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
          setLocations((prevLocations) => [...prevLocations, newLocation]); // Adds the entered Location to the existing Locations
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
    }, 200); // Debounce delay of 300ms

    setDebounceTimeout(newTimeout); // Update the debounceTimeout state
  }

  return (
    <div className="App">
      <nav className="navbar bg-body-tertiary p-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <a className="navbar-brand d-flex align-items-center" href="navbar">
            <img
              src={`${process.env.PUBLIC_URL}/assets/route.png`}
              alt="Logo"
              width="30"
              height="30"
              className="d-inline-block align-text-top"
            />
            <span
              style={{
                marginLeft: "20px",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              Routeplanner
            </span>
          </a>

          <span
            className="text-muted mx-3"
            style={{ fontSize: "1.2rem", paddingLeft: "250px" }}
          >
            Current Selected Route
          </span>

          <form
            className="d-flex align-items-start position-relative"
            role="search"
          >
            <div className="position-relative" style={{ flexGrow: 1 }}>
              <input
                className="form-control"
                aria-label="Search"
                type="search"
                ref={adressInput}
                placeholder="Enter an address"
                onChange={getAutocompletion}
                autoComplete="off" // Prevents default browser autocompletion
                style={{ width: "400px" }} // Make the input field wider
              />

              {/* Custom dropdown styling for suggestions */}
              {suggestions.length > 0 && (
                <ul
                  className="dropdown-menu show w-100 position-absolute"
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    top: "100%",
                  }}
                >
                  {suggestions.map((sug, index) => (
                    <li key={index}>
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => {
                          adressInput.current.value = sug.display_name;
                          setSuggestions([]); // Clear suggestions after selection
                        }}
                      >
                        {sug.display_name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={setNewAdress}
              className="btn btn-outline-primary ms-2"
              type="submit"
            >
              Set Address
            </button>
          </form>
        </div>
      </nav>

      <div
        className="map-container"
        style={{ height: "92vh", overflow: "hidden" }}
      >
        {/* Conditionally render the map if the location is available */}
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
