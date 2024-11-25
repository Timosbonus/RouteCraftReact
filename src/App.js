import "./App.css";
import { useState } from "react";
import MapAndLocationSelectionScreen from "./Components/MapAndLocationSelectionScreen";
import RouteOverviewComponent from "./Components/RouteOverviewComponent";

function App() {
  const [routeId, setRouteId] = useState(false); // routeId for database access

  function handleSetRouteId(input) {
    setRouteId(input);
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
