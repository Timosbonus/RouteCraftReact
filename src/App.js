import "./App.css";
import { useState } from "react";
import MapAndLocationSelectionScreen from "./Components/MapAndLocationSelectionScreen";
import RouteOverviewComponent from "./Components/RouteOverviewComponent";

function App() {
  const [routeId, setRouteId] = useState(""); // routeId for database access

  let curView = <RouteOverviewComponent routeId={routeId}></RouteOverviewComponent>;
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
