import "./LocationsRoutesComp.css";

function LocationRoutesComp({ locations, directions }) {
  const locationList = locations.map((current, index) => (
    <button key={index}>{current.display_name}</button>
  ));
  /*
  const directionList = directions.map((current, index) => (
    <h1>{current.routes[0].duration}</h1>
  ));
*/
  return (
    <div className="listing-container">
      <h1>Hello</h1>
      <ul>{locationList}</ul>
    </div>
  );
}

export default LocationRoutesComp;
