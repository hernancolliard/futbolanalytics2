import React from 'react';

const EventsTable = ({ events }) => {
  return (
    <div className="events-table">
      <h2>📋 EVENTOS REGISTRADOS</h2>
      <table>
        <thead>
          <tr>
            <th>Tiempo</th>
            <th>Jugador</th>
            <th>Acción</th>
            <th>Resultado</th>
            <th>Zona</th>
            <th>✏️</th>
            <th>🗑️</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td>{event.time}</td>
              <td>{event.player}</td>
              <td>{event.action}</td>
              <td>{event.result}</td>
              <td>{event.zone}</td>
              <td className="action-icons"><button>✏️</button></td>
              <td className="action-icons"><button>🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
