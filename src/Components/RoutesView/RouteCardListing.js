import "./RouteCardListing.css";
import { deleteSelectedRoute, getAllRoutes } from "../etc/backendConfig";
import { useState, useEffect } from "react";
import Modal from "../NavbarModalAuto/Modal";
import DeletionModal from "../NavbarModalAuto/DeletionModal";

function RouteCardListing({
  handleSetRouteInformation,
  handleEditRouteInformation,
  setRouteInformation,
}) {
  const [allRoutes, setAllRoutes] = useState([]);
  const [selectedRouteToDelete, setSelectedRouteToDelete] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // useEffect to get all Routes from Backend
  useEffect(() => {
    fetchRoutes();
  }, []);

  async function fetchRoutes() {
    try {
      const fetchedRoutes = await getAllRoutes();
      setAllRoutes(fetchedRoutes);
    } catch (err) {
      return <div>Fehler beim Laden der Routen</div>;
    }
  }

  function handleSelectedRouteDeletion(event, routeId) {
    event.stopPropagation();
    setSelectedRouteToDelete(routeId);
  }

  function deleteRouteByButtonClick(event, routeId) {
    setRouteInformation(false);
    deleteSelectedRoute(routeId).then((deleted) => {
      fetchRoutes();
      handleSelectedRouteDeletion(event, null);
      setModalOpen(false);
    });
  }

  return (
    <div>
      <div className="route-list">
        {allRoutes.map((r) => (
          <div
            key={r.routeId}
            className="route-card"
            onClick={() => handleSetRouteInformation(r)}
          >
            <div className="route-card-content">
              <div className="route-card-text">
                <h3>{r.routeId}</h3>
                <p>Start Time: {r.startTime} Uhr</p>
                <p>Break Time: {r.defaultBreakDuration} min</p>
              </div>
              <div className="route-card-buttons">
                <button
                  onClick={(event) => handleEditRouteInformation(event, r)}
                  className="icon-button"
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/editing.png`}
                    alt="Edit"
                    className="icon-button-image"
                  />
                </button>
                <button
                  onClick={(event) => {
                    handleSelectedRouteDeletion(event, r.routeId);
                    setModalOpen(true);
                  }}
                  className="icon-button"
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/bin.png`}
                    alt="Delete"
                    className="icon-button-image"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <DeletionModal
          deleteSelectedRoute={deleteRouteByButtonClick}
          route={selectedRouteToDelete}
        >
          Soll die Route wirklich gelöscht werden?
        </DeletionModal>
      </Modal>
    </div>
  );
}

export default RouteCardListing;
