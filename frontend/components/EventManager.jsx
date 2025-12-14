import React from 'react';

const EventManager = () => {
  return (
    <div className="event-manager">
      <h2>🏷️ EVENTOS</h2>
      <div className="button-group">
        <button>Pase ✅</button>
        <button>Pase ❌</button>
        <button>Tiro ✅</button>
        <button>Tiro ❌</button>
        <button>Gol</button>
        <button>Falta</button>
        <button>Duelo ✅</button>
        <button>Duelo ❌</button>
      </div>
      <div className="dropdown-group">
        <select>
          <option>▼ Jugador</option>
          {/* Add players here */}
        </select>
        <select>
          <option>▼ Zona</option>
          {/* Add zones here */}
        </select>
      </div>
    </div>
  );
};

export default EventManager;
