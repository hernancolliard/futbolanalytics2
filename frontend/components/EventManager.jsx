import React, { useState } from 'react';

const EventManager = ({ onAddEvent, players, zones }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]);
  const [selectedZone, setSelectedZone] = useState(zones[0]);

  const handleEventClick = (action, result) => {
    // Helper to format the current time as MM:SS
    const getCurrentTime = () => {
        const now = new Date();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    const newEvent = {
      time: getCurrentTime(),
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
        <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
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
