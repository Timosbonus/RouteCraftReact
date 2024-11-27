import { useRef } from "react";

function RouteModal({ children, handleNewRouteInformation, routeInformation }) {
  // refs for standard values
  const newRouteId = useRef("");
  const breakDuration = useRef(20);
  const startTime = useRef("07:30");

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
            defaultValue={"Ersigstraße 10a, 76275 Ettlingen"}
          />
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
