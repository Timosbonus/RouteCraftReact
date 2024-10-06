import React, { useState, useEffect } from "react";
import "./LocationsRoutesComp.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function LocationRoutesComp({ locations, directions, setLocations }) {
  const [startTime, setStartTime] = useState("07:00");
  const [defaultBreakDuration, setDefaultBreakDuration] = useState(20); // in Minuten
  const [breakDurations, setBreakDurations] = useState([]); // für individuelle Pausen

  // Initialisiere die Pausendauern basierend auf der Anzahl der Routen
  useEffect(() => {
    setBreakDurations(Array(directions.length).fill(defaultBreakDuration));
  }, [directions.length, defaultBreakDuration]);

  // Handhabt die Startzeit
  const handleTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleDefaultBreakChange = (event) => {
    const newDefaultBreak = Number(event.target.value);
    setDefaultBreakDuration(newDefaultBreak);

    // Aktualisiere alle Pausendauern auf den neuen Standardwert
    const updatedBreaks = breakDurations.map(() => newDefaultBreak);
    setBreakDurations(updatedBreaks);
  };

  const handleBreakDurationChange = (index, event) => {
    const newBreaks = [...breakDurations];
    newBreaks[index] = Number(event.target.value);
    setBreakDurations(newBreaks);
  };

  const calculateArrivalTime = (index) => {
    if (index === 0) return ""; // Keine Ankunftszeit für die erste Adresse

    const startDate = new Date();
    const [hours, minutes] = startTime.split(":").map(Number);
    startDate.setHours(hours);
    startDate.setMinutes(minutes);

    // Berechne die gesamte Fahrtdauer bis zur aktuellen Position
    const totalDuration = directions
      .slice(0, index)
      .reduce((acc, dir) => acc + dir.routes[0].duration, 0);

    // Berechne die Ankunftszeit ohne Pausen
    const arrivalDate = new Date(startDate.getTime() + totalDuration * 1000);

    return arrivalDate; // Rückgabe als Datum
  };

  const calculateDepartureTime = (index) => {
    if (index === 0) return startTime; // Bei der ersten Adresse ist es die Startzeit

    const arrivalDate = calculateArrivalTime(index);
    if (!arrivalDate) return "";

    const breakDuration = breakDurations[index] || defaultBreakDuration; // Holen Sie sich die Pausendauer
    const departureDate = new Date(
      arrivalDate.getTime() + breakDuration * 60 * 1000
    );

    return departureDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }); // Formatieren als HH:MM
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(locations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocations(items); // Aktualisiere den Status mit der neuen Reihenfolge
    setBreakDurations(Array(items.length).fill(defaultBreakDuration)); // Setze Pausendauern auf Standard zurück beim Neuanordnen
  };

  return (
    <div className="listing-container">
      <h2>Aktuelle Route</h2>
      <div className="time-input-container">
        <label htmlFor="appt">Abfahrtszeit</label>
        <input
          type="time"
          onChange={handleTimeChange}
          value={startTime}
          className="departure-time"
        />
      </div>
      <div className="time-input-container">
        <label htmlFor="defaultBreak">Standard Pause (Minuten)</label>
        <input
          type="number"
          onChange={handleDefaultBreakChange}
          value={defaultBreakDuration}
          className="break-duration"
          placeholder="Standard Pause"
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
                            Ankunft:{" "}
                            {calculateArrivalTime(index).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                            <span className="departure-time-display">
                              Abfahrt: {calculateDepartureTime(index)}
                            </span>
                            <input
                              type="number"
                              value={breakDurations[index]}
                              onChange={(event) =>
                                handleBreakDurationChange(index, event)
                              }
                              className="break-duration"
                              placeholder="Pause (Min)"
                            />
                          </div>
                        )}
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
