import "./App.css";
import { useRef, useState, useEffect } from "react";
import Map from "./Components/Map";

function App() {
  const adressInput = useRef(null); // Initialize ref with null
  const [adressData, setAdressData] = useState(null);

  useEffect(() => {
    fetch(
      "https://us1.locationiq.com/v1/search?key=pk.59909c833b95a185032a1981fe1619ae&q=Statue%20of%20Liberty,%20New%20York&format=json"
    )
      .then((response) => response.json())
      .then((json) => setAdressData(json))
      .catch((error) => console.error(error));
    console.log(adressData);
  }, [adressInput]);

  function setNewAdress() {
    const inputValue = adressInput.current.value; // Access the input's value
    console.log(inputValue); // Do something with the input value (e.g., geocode it, update the map, etc.)
  }

  return (
    <>
      <div className="App">
        <div>
          <input ref={adressInput} placeholder="Enter an address" />
          <button onClick={setNewAdress}>Set Address</button>{" "}
          {/* Correct button closing */}
        </div>
        <Map /> {/* You can later pass the address to the Map if needed */}
      </div>
    </>
  );
}

export default App;
