import { useEffect, useState } from "react";
import "./RouteCardListing.css";
import { deleteSelectedRoute, getAllRoutes } from "../etc/backendConfig";

function RouteCardListing({ handleSetRouteInformation }) {
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

  function deleteRouteByButtonClick(routeId) {
    deleteSelectedRoute(routeId).then(() => {
      fetchRoutes();
    });
  }

  return (
    <div className="route-list">
      {allRoutes.map((r) => (
        <div key={r.routeId} className="route-card">
          <div className="route-card-content">
            <div className="route-card-text">
              <h3>{r.routeId}</h3>
              <p>Start Time: {r.startTime} Uhr</p>
              <p>Break Time: {r.defaultBreakDuration} min</p>
            </div>
            <div className="route-card-buttons">
              <button
                onClick={() => handleSetRouteInformation(r)}
                className="icon-button"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/assets/editing.png`}
                  alt="Edit"
                  className="icon-button-image"
                />
              </button>
              <button
                onClick={() => deleteRouteByButtonClick(r.routeId)}
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
  );
}

export default RouteCardListing;
