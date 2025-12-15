import React, { useState, useEffect } from 'react';
import api from '../src/services/api';

const EventManager = ({ onAddEvent, players, zones, videoTime, selectedZone, onZoneChange }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]);
  const [successMessage, setSuccessMessage] = useState('');
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
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleEventClick = (buttonName) => {
    const newEvent = {
      time: formatTime(videoTime),
      player: selectedPlayer,
      action: buttonName,
      result: '', // This will be handled by descriptor matrices later
      zone: selectedZone,
    };
    onAddEvent(newEvent);
    setSuccessMessage('¡Evento creado con éxito!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="event-manager">
      <h2>🏷️ EVENTOS</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div className="button-group">
        {buttons.map(button => (
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
        <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}>
          <option disabled>▼ Jugador</option>
          {players.map(player => (
            <option key={player} value={player}>{player}</option>
          ))}
        </select>
        <select value={selectedZone} onChange={(e) => onZoneChange(e.target.value)}>
          <option disabled>▼ Zona</option>
          {zones.map(zone => (
            <option key={zone} value={zone}>{zone}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EventManager;