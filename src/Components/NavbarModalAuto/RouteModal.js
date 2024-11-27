import { useRef, useState } from "react";
import AdressAuto from "./AdressAuto";

function RouteModal({ children, handleNewRouteInformation, routeInformation }) {
  // refs for standard values
  const newRouteId = useRef(new Date().toLocaleDateString("de-DE")); // uses date of today as current routeName
  const breakDuration = useRef(20);
  const startTime = useRef("07:30");
  const [adressInput, setAdressInput] = useState(
    "Ersigstraße 10a, 76275 Ettlingen"
  ); // adressInput Standard Value
  const [showAdressAuto, setShowAdressAuto] = useState(false); // state to handle when the AdressAuto Component suggestions should show up

  // handles new SetAdressInput and sets the state of showAdressAuto
  function handleSetAdressInput(input, showState) {
    setAdressInput(input);
    setShowAdressAuto(showState);
  }

  if (routeInformation) {
    // checks if routeId is false, if not gets already existing values
    newRouteId.current = routeInformation.routeId;
    breakDuration.current = routeInformation.breakDuration;
    startTime.current = routeInformation.startTime;
  }

  return (
    <div>
      {children}
      <form>
        <div>
          <label>Route Name</label>
          <input
            type="text"
            id="routeId"
            defaultValue={newRouteId.current}
            ref={newRouteId} // ref for newRouteId
          />
        </div>
        <div>
          <label>Break</label>
          <input
            type="number"
            id="breakDuration"
            defaultValue={breakDuration.current}
            ref={breakDuration} // ref for Break
          />
        </div>
        <div>
          <label>Start Time</label>
          <input
            type="time"
            id="startTime"
            defaultValue={startTime.current}
            ref={startTime} // ref for startTime
          />
        </div>
        <div>
          <label>Adress</label>
          <input
            type="text"
            id="adress"
            value={adressInput}
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
        <button
          type="submit"
          style={{ marginTop: "20px" }}
          onClick={() =>
            handleNewRouteInformation(newRouteId, breakDuration, startTime, adressInput)
          }
        >
          Save new Route
        </button>
      </form>
    </div>
  );
}

export default RouteModal;
