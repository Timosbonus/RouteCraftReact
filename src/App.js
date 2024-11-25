import "./App.css";
import { useState } from "react";
import MapAndLocationSelectionScreen from "./Components/MapAndLocationSelectionScreen";
import RouteOverviewComponent from "./Components/RouteOverviewComponent";
import { updateSelectedRoute } from "./Components/backendConfig";

function App() {
  const [routeInformation, setRouteInformation] = useState(false); // routeId for database access

  function handleSetRouteInformation(input) {
    updateSelectedRoute(input)
      .then((newRoute) => {
        setRouteInformation(newRoute);
      })
      .catch((error) => {
        console.error("Error updating Route: ", error);
      });
  }

  let curView = (
    <RouteOverviewComponent
      routeInformation={routeInformation}
      setRouteInformation={handleSetRouteInformation}
    ></RouteOverviewComponent>
  );
  if (routeInformation) {
    curView = (
      <MapAndLocationSelectionScreen
        routeInformation={routeInformation}
      ></MapAndLocationSelectionScreen>
    );
  }

  return <>{curView}</>;
}

export default App;
