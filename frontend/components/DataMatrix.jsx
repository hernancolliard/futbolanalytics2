import React from 'react';
import './DataMatrix.css';

const DataMatrix = ({ events, onCellClick }) => {
  if (!events || events.length === 0) {
    return <p>No hay eventos para mostrar en la matriz.</p>;
  }

  // Lógica para procesar los eventos y crear la matriz
  const data = events.reduce((acc, event) => {
    const { player, event_type } = event;
    if (!player || !event_type) return acc;

    if (!acc[player]) {
      acc[player] = {};
    }
    if (!acc[player][event_type]) {
      acc[player][event_type] = 0;
    }
    acc[player][event_type]++;
    return acc;
  }, {});

  const players = Object.keys(data);
  const actions = [...new Set(events.map(e => e.event_type).filter(Boolean))];

  return (
    <div className="data-matrix-container">
      <h3>Matriz de Datos</h3>
      <table className="data-matrix-table">
        <thead>
          <tr>
            <th>Jugador</th>
            {actions.map(action => (
              <th key={action}>{action}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player}>
              <td>{player}</td>
              {actions.map(action => (
                <td key={action} onClick={() => onCellClick(player, action)}>
                  {data[player][action] || 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataMatrix;
