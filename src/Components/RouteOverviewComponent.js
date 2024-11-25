import { useState } from "react";
import Navbar from "./Navbar";
import Modal from "./Modal";
import RouteModal from "./RouteModal";

function RouteOverviewComponent({ routeId, setRouteId }) {
  const [isModalOpen, setModalOpen] = useState(false); // state for current modal state

  function handleNewRouteInformation(routeId, breakDuration, startTime) {
    setRouteId({
      routeId: routeId,
      breakDuration: breakDuration,
      startTime: startTime,
    });
    setModalOpen(false);
  }

  return (
    <>
      <Navbar routeId={routeId} setModalOpen={setModalOpen}></Navbar>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <RouteModal
          handleNewRouteInformation={handleNewRouteInformation}
          routeId={routeId}
        >
          <h2>Add new Route</h2>
          <p>Add all relevant Information below</p>
        </RouteModal>
      </Modal>
    </>
  );
}

export default RouteOverviewComponent;
