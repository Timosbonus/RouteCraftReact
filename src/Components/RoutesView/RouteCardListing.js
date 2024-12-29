import "./RouteCardListing.css";

function RouteCardListing({
  handleSetRouteInformation,
  handleEditRouteInformation,
  deleteRouteByButtonClick,
  allRoutes,
}) {
  return (
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
                onClick={(e) => deleteRouteByButtonClick(e, r.routeId)}
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
