import { useState } from "react";
import Navbar from "../NavbarModalAuto/Navbar";
import Modal from "../NavbarModalAuto/Modal";
import RouteModal from "../NavbarModalAuto/RouteModal";
import RouteCardListing from "./RouteCardListing"

function RouteOverviewComponent({
  routeInformation,
  handleSetRouteInformation,
  setNewAdress,
}) {
  const [isModalOpen, setModalOpen] = useState(false); // state for current modal state

  function handleNewRouteInformation(
    newRouteId,
    breakDuration,
    startTime,
    adressInput
  ) {
    const newRoute = {
      routeId: newRouteId.current.value,
      defaultBreakDuration: breakDuration.current.value,
      startTime: startTime.current.value,
    };

    handleSetRouteInformation(newRoute);
    setNewAdress(adressInput, newRoute);

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
      <RouteCardListing handleSetRouteInformation={handleSetRouteInformation}></RouteCardListing>
    </>
  );
}

export default RouteOverviewComponent;
