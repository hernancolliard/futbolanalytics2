import React from 'react';

const EventsTable = () => {
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
          <tr>
            <td>12:33</td>
            <td>Pérez</td>
            <td>Pase</td>
            <td>✅</td>
            <td>2</td>
            <td className="action-icons"><button>✏️</button></td>
            <td className="action-icons"><button>🗑️</button></td>
          </tr>
          <tr>
            <td>13:10</td>
            <td>Gómez</td>
            <td>Tiro</td>
            <td>❌</td>
            <td>5</td>
            <td className="action-icons"><button>✏️</button></td>
            <td className="action-icons"><button>🗑️</button></td>
          </tr>
          {/* More events will be listed here */}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
