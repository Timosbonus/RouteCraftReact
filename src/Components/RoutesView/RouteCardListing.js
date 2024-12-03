import { useEffect, useState } from "react";
import "./RouteCardListing.css";
import { getAllRoutes } from "../etc/backendConfig";

function RouteCardListing({ handleSetRouteInformation }) {
  const [allRoutes, setAllRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to get all Routes from Backend
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const fetchedRoutes = await getAllRoutes();
        setAllRoutes(fetchedRoutes);
      } catch (err) {
        setError("Fehler beim Laden der Routen");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  console.log(allRoutes);

  return (
    <div className="route-list">
      {allRoutes.map((r) => (
        <div
          key={r.routeId}
          className="route-card"
          onClick={() => handleSetRouteInformation(r)}
        >
          <div className="route-card-header">
            <h3>{r.routeId}</h3>
          </div>
          <div className="route-card-body">
            <p>Start Time: {r.startTime}</p>
            <p>Default Break Time: {r.defaultBreakDuration} min</p>{" "}
            {/* Default Break Time */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RouteCardListing;
