import "./AdressAuto.css";
import { useState, useRef, useEffect } from "react";

function AdressAuto({ adressInput, handleSetAdressInput, setShowAdressAuto }) {
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null); // timeout for too many api calls for the suggestions
  const dropdownRef = useRef(null); // Reference for the dropdown

  // useEffect to get the autocompletion feature for the addresses when input changes
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // sets new timeout after the api call
    const newTimeout = setTimeout(() => {
      if (adressInput.length >= 3) {
        fetch(
          `https://api.locationiq.com/v1/autocomplete?key=${
            process.env.REACT_APP_LOCATIONIQ_KEY
          }&q=${encodeURIComponent(adressInput)}&limit=5&dedupe=1&`
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
  }, [adressInput]);

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

  return (
    <>
      {suggestions.length > 0 && (
        <ul className="custom-dropdown" ref={dropdownRef}>
          {suggestions.map((sug, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => {
                  handleSetAdressInput(sug.display_name, false);
                  setSuggestions([]);
                }}
              >
                {sug.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default AdressAuto;
