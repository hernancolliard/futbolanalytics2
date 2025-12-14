import React, { useState } from 'react';

const EventManager = ({ onAddEvent, players, zones, videoTime, selectedZone, onZoneChange }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleEventClick = (action, result) => {
    const newEvent = {
      time: formatTime(videoTime),
      player: selectedPlayer,
      action,
      result,
      zone: selectedZone,
    };
    onAddEvent(newEvent);
  };

  return (
    <div className="event-manager">
      <h2>🏷️ EVENTOS</h2>
      <div className="button-group">
        <button onClick={() => handleEventClick('Pase', '✅')}>Pase ✅</button>
        <button onClick={() => handleEventClick('Pase', '❌')}>Pase ❌</button>
        <button onClick={() => handleEventClick('Tiro', '✅')}>Tiro ✅</button>
        <button onClick={() => handleEventClick('Tiro', '❌')}>Tiro ❌</button>
        <button onClick={() => handleEventClick('Gol', '✅')}>Gol</button>
        <button onClick={() => handleEventClick('Falta', '❌')}>Falta</button>
        <button onClick={() => handleEventClick('Duelo', '✅')}>Duelo ✅</button>
        <button onClick={() => handleEventClick('Duelo', '❌')}>Duelo ❌</button>
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
