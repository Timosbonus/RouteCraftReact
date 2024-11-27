import "./App.css";
import { useState } from "react";
import MapAndLocationSelectionScreen from "./Components/MapView/MapAndLocationSelectionScreen";
import RouteOverviewComponent from "./Components/RoutesView/RouteOverviewComponent";
import { updateSelectedRoute } from "./Components/etc/backendConfig";

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
        handleSetRouteInformation={handleSetRouteInformation}
      ></MapAndLocationSelectionScreen>
    );
  }

  return <>{curView}</>;
}

export default App;
