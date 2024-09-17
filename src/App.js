import "./App.css";
import { useRef, useState } from "react";
import Map from "./Components/Map";

function App() {
  const adressInput = useRef(null); // Initialize ref with null
  const [adressData, setAdressData] = useState(null);

  function setNewAdress() {
    const inputValue = adressInput.current.value; // Access the input's value

    fetch(
      `https://us1.locationiq.com/v1/search?key=pk.59909c833b95a185032a1981fe1619ae&q=${encodeURIComponent(
        inputValue
      )}&format=json`
    )
      .then((response) => response.json())
      .then((json) => setAdressData(json))
      .catch((error) => console.error(error));

    console.log(adressData);
  }

  return (
    <>
      <div className="App">
        <div>
          <input ref={adressInput} placeholder="Enter an address" />
          <button onClick={setNewAdress}>Set Address</button>{" "}
        </div>
        <Map newAdressData={adressData} />
      </div>
    </>
  );
}

export default App;
