import "./App.css";
import { useState } from "react";
import MapAndLocationSelectionScreen from "./Components/MapAndLocationSelectionScreen";
import RouteOverviewComponent from "./Components/RouteOverviewComponent";
import { updateSelectedRoute } from "./Components/backendConfig";

function App() {
  const [routeId, setRouteId] = useState(false); // routeId for database access

  function handleSetRouteId(input) {
    updateSelectedRoute(input)
      .then((newRoute) => {
        setRouteId(newRoute);
      })
      .catch((error) => {
        console.error("Error updating Route: ", error);
      });
  }

  let curView = (
    <RouteOverviewComponent
      routeId={routeId}
      setRouteId={handleSetRouteId}
    ></RouteOverviewComponent>
  );
  if (routeId) {
    curView = (
      <MapAndLocationSelectionScreen
        routeId={routeId}
      ></MapAndLocationSelectionScreen>
    );
  }

  return <>{curView}</>;
}

export default App;
