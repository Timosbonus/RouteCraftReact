import AdressAuto from "./AdressAuto";
import "./Navbar.css";
import { useState } from "react";

function Navbar({ setNewAdress, routeInformation, setModalOpen }) {
  const [adressInput, setAdressInput] = useState("");
  const [showAdressAuto, setShowAdressAuto] = useState(false); // state to handle when the AdressAuto Component suggestions should show up

  // handles new SetAdressInput and sets the state of showAdressAuto
  function handleSetAdressInput(input, showState) {
    setAdressInput(input);
    setShowAdressAuto(showState);
  }

  // Helper Function to get the event from the form und call setNewAdress Function
  const handleSubmit = (event) => {
    event.preventDefault();
    setNewAdress(adressInput);
  };

  // button, when no Route is selected
  let formAndButtonVersion = (
    <button
      onClick={setModalOpen}
      className="custom-btn custom-btn-add-route"
      type="submit"
    >
      Add Route
    </button>
  );

  // form and button, when Route is selected
  if (routeInformation) {
    formAndButtonVersion = (
      <form
        className="custom-search-form"
        role="search"
        onSubmit={handleSubmit}
      >
        <div className="custom-input-wrapper">
          <input
            type="search"
            value={adressInput}
            placeholder="Enter an address"
            onChange={(e) => handleSetAdressInput(e.target.value, true)}
          />
          {showAdressAuto && ( // shows the AdressAutoComponent only, if showAdressAuto is true
            <AdressAuto
              setShowAdressAuto={setShowAdressAuto}
              adressInput={adressInput}
              handleSetAdressInput={handleSetAdressInput}
            ></AdressAuto>
          )}
        </div>

        <button className="custom-btn" type="submit">
          Set Address
        </button>
      </form>
    );
  }

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
          <h1 className="custom-title">RouteCraft</h1>
        </a>

        <h1 className="current-route">
          {routeInformation
            ? routeInformation.routeId.toUpperCase()
            : "No Route Selected"}
        </h1>

        {formAndButtonVersion}
      </div>
    </nav>
  );
}

export default Navbar;
