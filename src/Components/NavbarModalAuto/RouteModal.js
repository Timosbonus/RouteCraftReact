import { useRef, useState } from "react";
import AdressAuto from "./AdressAuto";

function RouteModal({ children, handleNewRouteInformation, routeInformation }) {
  // refs for standard values
  const newRouteId = useRef(new Date().toLocaleDateString("de-DE"));
  const breakDuration = useRef(20);
  const startTime = useRef("07:30");
  const [adressInput, setAdressInput] = useState(
    "Ersigstraße 10a, 76275 Ettlingen"
  );
  const [showAdressAuto, setShowAdressAuto] = useState(false);

  function handleSetAdressInput(input, showState) {
    setAdressInput(input);
    setShowAdressAuto(showState);
  }

  if (routeInformation) {
    // checks if routeId is false
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
            ref={newRouteId}
          />
        </div>
        <div>
          <label>Break</label>
          <input
            type="number"
            id="breakDuration"
            defaultValue={breakDuration.current}
            ref={breakDuration} // ref für Break
          />
        </div>
        <div>
          <label>Start Time</label>
          <input
            type="time"
            id="startTime"
            defaultValue={startTime.current}
            ref={startTime} // ref für Startzeit
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
          {showAdressAuto && (
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
            handleNewRouteInformation(newRouteId, breakDuration, startTime)
          }
        >
          Save new Route
        </button>
      </form>
    </div>
  );
}

export default RouteModal;
