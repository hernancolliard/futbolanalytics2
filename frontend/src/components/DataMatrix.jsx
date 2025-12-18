import React from "react";
import "./DataMatrix.css";

const DataMatrix = ({ events, onCellClick }) => {
  if (!events || events.length === 0) {
    return <p>No hay eventos para mostrar en la matriz.</p>;
  }

  // Lógica para procesar los eventos y crear la matriz
  // Agrupar por player.id y conservar el nombre
  const data = events.reduce((acc, event) => {
    const { player, event_type } = event;
    if (!player || !event_type) return acc;
    const pid = player.id ?? String(player);
    if (!acc[pid]) {
      acc[pid] = { name: player.name ?? String(player), counts: {} };
    }
    if (!acc[pid].counts[event_type]) {
      acc[pid].counts[event_type] = 0;
    }
    acc[pid].counts[event_type]++;
    return acc;
  }, {});

  const players = Object.keys(data).map((pid) => ({
    id: pid,
    name: data[pid].name,
    counts: data[pid].counts,
  }));
  const actions = [...new Set(events.map((e) => e.event_type).filter(Boolean))];

  return (
    <div className="data-matrix-container">
      <h3>Matriz de Datos</h3>
      <table className="data-matrix-table">
        <thead>
          <tr>
            <th>Jugador</th>
            {actions.map((action) => (
              <th key={action}>{action}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              {actions.map((action) => (
                <td
                  key={action}
                  onClick={() =>
                    onCellClick(
                      { id: Number(player.id), name: player.name },
                      action
                    )
                  }
                >
                  {player.counts[action] || 0}
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
