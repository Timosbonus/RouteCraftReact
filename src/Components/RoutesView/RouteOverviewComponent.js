import { useState } from "react";
import Navbar from "../NavbarModalAuto/Navbar";
import Modal from "../NavbarModalAuto/Modal";
import RouteModal from "../NavbarModalAuto/RouteModal";
import RouteCardListing from "./RouteCardListing";

function RouteOverviewComponent({
  routeInformation,
  setRouteInformation,
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

  function handleEditRouteInformation(event, currentRouteInfo) {
    event.stopPropagation(); // Prevents the event from bubbling up to the parent div
  }

  return (
    <>
      <div className="overview_container">
        <Navbar
          routeInformation={routeInformation}
          setModalOpen={setModalOpen}
        ></Navbar>
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <RouteModal handleNewRouteInformation={handleNewRouteInformation}>
            <h2>Edit Route</h2>
            <p>Add all relevant Information below</p>
          </RouteModal>
        </Modal>
        <RouteCardListing
          handleSetRouteInformation={handleSetRouteInformation}
          handleEditRouteInformation={handleEditRouteInformation}
          setRouteInformation={setRouteInformation}
        ></RouteCardListing>
      </div>
    </>
  );
}

export default RouteOverviewComponent;
