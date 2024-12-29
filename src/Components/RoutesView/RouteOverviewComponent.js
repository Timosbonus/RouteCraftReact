import { useState, useEffect } from "react";
import Navbar from "../NavbarModalAuto/Navbar";
import Modal from "../NavbarModalAuto/Modal";
import RouteModal from "../NavbarModalAuto/RouteModal";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to get all Routes from Backend
  useEffect(() => {
    fetchRoutes();
  }, [allRoutes]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  async function fetchRoutes() {
    try {
      const fetchedRoutes = await getAllRoutes();
      setAllRoutes(fetchedRoutes);
    } catch (err) {
      setError("Fehler beim Laden der Routen");
    } finally {
      setLoading(false);
    }
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

  function deleteRouteByButtonClick(event, routeId) {
    event.stopPropagation(); // Prevents the event from bubbling up to the parent div
    setRouteInformation(false);
    deleteSelectedRoute(routeId).then(() => {
      fetchRoutes();
    });
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
        <RouteCardListing
          handleSetRouteInformation={handleSetRouteInformation}
          handleEditRouteInformation={handleEditRouteInformation}
          allRoutes={allRoutes}
        ></RouteCardListing>
      </div>
    </>
  );
}

export default RouteOverviewComponent;
