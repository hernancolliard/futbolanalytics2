import React, { useState, useEffect } from "react";
import api from "../services/api";
import FieldSelector from "./FieldSelector"; // Import the new component

const EventManager = ({ onAddEvent, players, videoTime }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState(
    players && players.length > 0 ? players[0].id : ""
  );
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    x: null,
    y: null,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    fetchButtons();
  }, []);

  const fetchButtons = async () => {
    try {
      const response = await api.getButtons();
      setButtons(response.data);
    } catch (error) {
      console.error("Error fetching buttons:", error);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(timeInSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleCoordinatesSelect = (coords) => {
    setSelectedCoordinates(coords);
  };

  const handleEventClick = (buttonName) => {
    if (selectedCoordinates.x === null || selectedCoordinates.y === null) {
      alert("Por favor, selecciona una posición en el campo.");
      return;
    }

    const playerObj = players.find((p) => p.id === Number(selectedPlayerId)) ||
      players.find((p) => p.id === selectedPlayerId) || {
        id: null,
        name: String(selectedPlayerId),
      };

    const newEvent = {
      time: formatTime(videoTime),
      player: playerObj,
      action: buttonName,
      result: "", // This will be handled by descriptor matrices later
      x: selectedCoordinates.x,
      y: selectedCoordinates.y,
    };
    onAddEvent(newEvent);
    setSuccessMessage("¡Evento creado con éxito!");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className="event-manager">
      <h2>🏷️ EVENTOS</h2>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <div className="button-group">
        {buttons.map((button) => (
          <button
            key={button.id}
            style={{ backgroundColor: button.color }}
            onClick={() => handleEventClick(button.name)}
          >
            {button.name}
          </button>
        ))}
      </div>
      <div className="dropdown-group">
        <select
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value)}
        >
          <option value="" disabled>
            ▼ Jugador
          </option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>
      <FieldSelector
        onCoordinatesSelect={handleCoordinatesSelect}
        selectedCoordinates={selectedCoordinates}
      />
    </div>
  );
};

export default EventManager;
