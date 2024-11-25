import { useRef } from "react";

function RouteModal({ children, handleNewRouteInformation, routeId }) {
  // refs for standard values
  const newRouteId = useRef("");
  const breakDuration = useRef(20);
  const startTime = useRef("07:00");

  if (routeId) {
    // checks if routeId is false
    newRouteId.current = routeId.routeId;
    breakDuration.current = routeId.breakDuration;
    startTime.current = routeId.startTime;
  }

  return (
    <div>
      {children}
      <form>
        <div>
          <label>Routenname</label>
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
