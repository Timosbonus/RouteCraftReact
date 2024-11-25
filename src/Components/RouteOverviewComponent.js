import { useState } from "react";
import Navbar from "./Navbar";
import Modal from "./Modal";
import RouteModal from "./RouteModal";

function RouteOverviewComponent({ routeInformation, setRouteInformation }) {
  const [isModalOpen, setModalOpen] = useState(false); // state for current modal state

  function handleNewRouteInformation(newRouteId, breakDuration, startTime) {
    setRouteInformation({
      routeId: newRouteId.current.value,
      defaultBreakDuration: breakDuration.current.value,
      startTime: startTime.current.value,
    });
    setModalOpen(false);
  }

  return (
    <>
      <Navbar routeInformation={routeInformation} setModalOpen={setModalOpen}></Navbar>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <RouteModal
          handleNewRouteInformation={handleNewRouteInformation}
          routeInformation={routeInformation}
        >
          <h2>Add new Route</h2>
          <p>Add all relevant Information below</p>
        </RouteModal>
      </Modal>
    </>
  );
}

export default RouteOverviewComponent;
