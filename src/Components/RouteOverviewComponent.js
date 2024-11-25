import { useState } from "react";
import Navbar from "./Navbar";
import Modal from "./Modal";

function RouteOverviewComponent({ routeId, setRouteId }) {
  const [isModalOpen, setModalOpen] = useState(false); // state for current modal state

  function handleNewRouteInformation() {
    setModalOpen(false);
  }

  return (
    <>
      <Navbar routeId={routeId} setModalOpen={setModalOpen}></Navbar>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <div>
          <h2>Add new Route</h2>
          <p>Add all relevant Information below</p>
          <form onSubmit={handleNewRouteInformation}>
            <div>
              <label>Routenname</label>
              <input type="text" id="routeId"></input>
            </div>
            <div>
              <label>Break</label>
              <input type="number" id="breakDuration"></input>
            </div>
            <div>
              <label>Start Time</label>
              <input type="time" id="startTime"></input>
            </div>
          </form>
          <button
            onClick={handleNewRouteInformation}
            style={{ marginTop: "20px" }}
          >
            Save new Route
          </button>
        </div>
      </Modal>
    </>
  );
}

export default RouteOverviewComponent;
