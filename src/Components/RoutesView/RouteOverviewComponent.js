import { useState } from "react";
import Navbar from "../NavbarModalAuto/Navbar";
import Modal from "../NavbarModalAuto/Modal";
import RouteModal from "../NavbarModalAuto/RouteModal";

function RouteOverviewComponent({
  routeInformation,
  setRouteInformation,
  setNewAdress,
}) {
  const [isModalOpen, setModalOpen] = useState(false); // state for current modal state

  function handleNewRouteInformation(
    newRouteId,
    breakDuration,
    startTime,
    adressInput
  ) {
    setRouteInformation({
      routeId: newRouteId.current.value,
      defaultBreakDuration: breakDuration.current.value,
      startTime: startTime.current.value,
    });
    setNewAdress(adressInput, newRouteId);
    setModalOpen(false);
  }

  return (
    <>
      <Navbar
        routeInformation={routeInformation}
        setModalOpen={setModalOpen}
      ></Navbar>
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
