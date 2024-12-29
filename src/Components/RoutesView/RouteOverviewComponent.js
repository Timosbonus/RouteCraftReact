import { useState, useEffect } from "react";
import Navbar from "../NavbarModalAuto/Navbar";
import Modal from "../NavbarModalAuto/Modal";
import RouteModal from "../NavbarModalAuto/RouteModal";
import DeletionModal from "../NavbarModalAuto/DeletionModal";
import RouteCardListing from "./RouteCardListing";

import { deleteSelectedRoute, getAllRoutes } from "../etc/backendConfig";

function RouteOverviewComponent({
  routeInformation,
  setRouteInformation,
  handleSetRouteInformation,
  setNewAdress,
}) {
  const [isModalOpen, setModalOpen] = useState(false); // state for current modal state
  const [deletionModal, setDeletionModal] = useState(false); // state for Modal to confirm deletion
  const [allRoutes, setAllRoutes] = useState([]);
  const [selectedRouteToDelete, setSelectedRouteToDelete] = useState(false);

  // useEffect to get all Routes from Backend
  useEffect(() => {
    fetchRoutes();
  }, [allRoutes]);

  async function fetchRoutes() {
    try {
      const fetchedRoutes = await getAllRoutes();
      setAllRoutes(fetchedRoutes);
    } catch (err) {
      return <div>Fehler beim Laden der Routen</div>;
    }
  }

  function performDeleteButtonActions(routeId) {
    setSelectedRouteToDelete(routeId);
  }

  function deleteRouteByButtonClick(event, routeId) {
    event.stopPropagation(); // Prevents the event from bubbling up to the parent div
    setRouteInformation(false);
    deleteSelectedRoute(routeId).then(() => {
      fetchRoutes();
    });
  }

  // adds new Route Information and adds first new Adress, Route ID etc.
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

  // function for editing Route Information -> not sure how to do it right now
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

        <Modal isOpen={deletionModal} onClose={() => setDeletionModal(false)}>
          <DeletionModal
            deleteSelectedRoute={performDeleteButtonActions}
            route={selectedRouteToDelete}
          >
            Du Wolle wirklich lösche ehh?
          </DeletionModal>
        </Modal>

        <RouteCardListing
          handleSetRouteInformation={handleSetRouteInformation}
          handleEditRouteInformation={handleEditRouteInformation}
          deleteRouteByButtonClick={performDeleteButtonActions}
          allRoutes={allRoutes}
        ></RouteCardListing>
      </div>
    </>
  );
}

export default RouteOverviewComponent;
