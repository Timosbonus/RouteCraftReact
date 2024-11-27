import "./MapAndLocationSelectionScreen.css";

import Map from "./Map";
import Navbar from "../NavbarModalAuto/Navbar";
import LocationRoutesComp from "./LocationRoutesComp";

function MapAndLocationSelectionScreen({
  routeInformation,
  handleSetRouteInformation,
  locations,
  directions,
  setLocations,
  setDirections,
  setNewAdress
}) {
  return (
    <div className="overview_container">
      <Navbar
        setNewAdress={setNewAdress}
        routeInformation={routeInformation}
      ></Navbar>

      <div className="map_locations_container">
        {locations.length ? (
          <>
            <Map
              locations={locations}
              directions={directions}
              setDirections={setDirections}
              routeInformation={routeInformation}
            />
            <LocationRoutesComp
              className="locations-routes-comp"
              locations={locations}
              directions={directions}
              setLocations={setLocations}
              handleSetRouteInformation={handleSetRouteInformation}
              routeInformation={routeInformation}
              setDirections={setDirections}
            />
          </>
        ) : (
          <p>Loading map...</p>
        )}
      </div>
    </div>
  );
}

export default MapAndLocationSelectionScreen;
