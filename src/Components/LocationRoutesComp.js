import React, { useState, useEffect } from "react";
import { usePrevious } from "@uidotdev/usehooks";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./LocationsRoutesComp.css";

function LocationRoutesComp({
  locations,
  directions,
  setLocations,
  defaultBreakDuration,
  setDefaultBreakDuration,
}) {
  const [startTime, setStartTime] = useState("07:00"); // standard start time
  const previousDefaultBreak = usePrevious(defaultBreakDuration);

  // save break durations in locations array
  useEffect(() => {
    for (let i = 1; i < locations.length; i++) {
      const current = locations[i].breakDuration;

      // Only update the break if it's set to the previous default break
      if (current === previousDefaultBreak) {
        locations[i].breakDuration = defaultBreakDuration;
      }
    }
    setLocations([...locations]); // Trigger a re-render with updated break durations
    // eslint-disable-next-line
  }, [defaultBreakDuration]);

  // handles start time
  const handleTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleDefaultBreakChange = (event) => {
    const newDefaultBreak = Number(event.target.value);
    setDefaultBreakDuration(newDefaultBreak);
  };

  const calculateArrivalTime = (index) => {
    if (index === 0) return ""; // no arrival time for first address

    const startDate = new Date();
    const [hours, minutes] = startTime.split(":").map(Number);
    startDate.setHours(hours);
    startDate.setMinutes(minutes);

    // calculate the total travel duration to the current position
    const totalDuration = directions
      .slice(0, index)
      .reduce((acc, dir) => acc + dir.routes[0].duration, 0);

    // calculate the total break duration to the current position
    let totalBreakDuration = 0;
    for (let i = 0; i < index; i++) {
      totalBreakDuration += locations[i].breakDuration;
    }

    // calculate the arrival time considering the breaks
    const arrivalDate = new Date(
      startDate.getTime() +
        totalDuration * 1000 +
        totalBreakDuration * 60 * 1000
    );

    return arrivalDate; // return as date
  };

  const calculateDepartureTime = (index) => {
    if (index === 0) return startTime; // for the first address, it's the start time

    const arrivalDate = calculateArrivalTime(index);
    if (!arrivalDate) return "";

    const breakDuration = locations[index].breakDuration; // get the break duration
    const departureDate = new Date(
      arrivalDate.getTime() + breakDuration * 60 * 1000
    );

    return departureDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }); // format as HH:MM
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(locations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocations(items); // update state with the new order
  };

  function displayUntilThirdComma(str) {
    const parts = str.split(","); // Split the string at commas
    if (parts.length < 3) {
      return str; // Return the whole string if there are fewer than 3 commas
    }
    return parts.slice(0, 3).join(","); // Join the first 3 parts with commas
  }

  return (
    <div className="listing-container">
      <h2>Current Route</h2>
      <div className="time-input-container">
        <label htmlFor="appt">Departure Time</label>
        <input
          type="time"
          onChange={handleTimeChange}
          value={startTime}
          className="departure-time"
        />
      </div>
      <div className="time-input-container">
        <label htmlFor="defaultBreak">Default Break (Minutes)</label>
        <input
          type="number"
          onChange={handleDefaultBreakChange}
          value={defaultBreakDuration}
          className="break-duration"
          placeholder="Default Break"
        />
      </div>

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
                        {index > 0 && (
                          <div className="arrival-time">
                            Arrival:{" "}
                            {calculateArrivalTime(index).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}{" "}
                            |
                            <span className="departure-time-display">
                              Departure: {calculateDepartureTime(index)} |
                            </span>
                            <span className="departure-time-display">
                              Break:
                            </span>
                            <input
                              type="number"
                              value={locations[index].breakDuration}
                              className="break-duration"
                              placeholder="Break (Min)"
                              onChange={(e) => {
                                const updatedLocations = [...locations];
                                updatedLocations[index].breakDuration = Number(
                                  e.target.value
                                );
                                setLocations(updatedLocations);
                              }}
                            />
                          </div>
                        )}

                        {displayUntilThirdComma(current.display_name)}
                      </li>
                    )}
                  </Draggable>

                  {/* Render the direction info below each location if it exists */}
                  {index < locations.length - 1 && directions[index] && (
                    <div className="direction-info">
                      <span>
                        Duration:{" "}
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
                        Distance:{" "}
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
