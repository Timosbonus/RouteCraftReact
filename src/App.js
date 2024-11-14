import "./App.css";
import { useState } from "react";
import MapAndLocationSelectionScreen from "./Components/MapAndLocationSelectionScreen";

function App() {
  const [routeId, setRouteId] = useState("route123"); // routeId for database access

  return (
    <MapAndLocationSelectionScreen
      routeId={routeId}
    ></MapAndLocationSelectionScreen>
  );
}

export default App;
