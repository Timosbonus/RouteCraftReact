import "./Navbar.css";
import { useState, useRef, useEffect } from "react";

function Navbar({ adressInput, setNewAdress }) {
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null); // timeout for too many api calls for the suggestions
  const dropdownRef = useRef(null); // Reference for the dropdown

  // function to get the autocompletion feature for the addresses
  function getAutocompletion() {
    const inputValue = adressInput.current.value;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // sets new timeout after the api call
    const newTimeout = setTimeout(() => {
      if (inputValue.length >= 3) {
        fetch(
          `https://api.locationiq.com/v1/autocomplete?key=${
            process.env.REACT_APP_LOCATIONIQ_KEY
          }&q=${encodeURIComponent(inputValue)}&limit=5&dedupe=1&`
        )
          .then((response) => response.json())
          .then((json) => {
            if (json && json.length > 0) {
              setSuggestions(json);
            } // getting data from api and filling in array to display data
          })
          .catch((error) => console.error("Error fetching address:", error));
      } else {
        setSuggestions([]); // Clear suggestions if input length is less than 3
      }
    }, 500);

    setDebounceTimeout(newTimeout);
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Helper Function to get the event from the form und call setNewAdress Function
  const handleSubmit = (event) => {
    event.preventDefault();
    const inputValue = adressInput.current.value;
    setNewAdress(inputValue);
  };

  return (
    <nav className="custom-navbar">
      <div className="custom-container">
        <a className="custom-brand" href="navbar">
          <img
            src={`${process.env.PUBLIC_URL}/assets/route.png`}
            alt="Logo"
            width="40"
            height="40"
          />
          <span className="custom-title">RouteCraft</span>
        </a>

        <span className="current-route">Current Selected Route</span>

        <form className="custom-search-form" role="search">
          <div className="custom-input-wrapper">
            <input
              type="search"
              ref={adressInput}
              placeholder="Enter an address"
              onChange={getAutocompletion}
              autoComplete="off"
            />

            {suggestions.length > 0 && (
              <ul className="custom-dropdown" ref={dropdownRef}>
                {suggestions.map((sug, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => {
                        adressInput.current.value = sug.display_name;
                        setSuggestions([]);
                      }}
                    >
                      {sug.display_name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={handleSubmit} className="custom-btn" type="submit">
            Set Address
          </button>
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
