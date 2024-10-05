import React from "react"; // Import React
import "./LocationsRoutesComp.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function LocationRoutesComp({ locations, directions, setLocations }) {
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(locations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocations(items); // Update the state with the new order
  };

  return (
    <div className="listing-container">
      <h2>Current Selected Route</h2>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="locations">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="location-list"
            >
              {locations.map((current, index) => (
                <React.Fragment key={current.place_id}>
                  <Draggable draggableId={current.place_id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="location-item"
                      >
                        {current.display_name}
                      </li>
                    )}
                  </Draggable>

                  {/* Render the direction info below each location if it exists */}
                  {index < locations.length - 1 && directions[index] && (
                    <div className="direction-info">
                      <span>
                        Dauer:{" "}
                        {directions[index].routes[0].duration > 3600 ? (
                          <>
                            {Math.floor(
                              directions[index].routes[0].duration / 3600
                            )}{" "}
                            h{" "}
                            {Math.round(
                              (directions[index].routes[0].duration % 3600) / 60
                            )}{" "}
                            min
                          </>
                        ) : (
                          `${Math.round(
                            directions[index].routes[0].duration / 60
                          )} min`
                        )}
                      </span>
                      <span>
                        Strecke:{" "}
                        {Math.round(
                          (directions[index].routes[0].distance / 1000) * 10
                        ) / 10}{" "}
                        km
                      </span>
                    </div>
                  )}
                </React.Fragment>
              ))}
              {provided.placeholder} {/* This is important for spacing */}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default LocationRoutesComp;
