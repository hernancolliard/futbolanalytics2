import React, { useState } from 'react';

const EventsTable = ({ events, onDeleteEvent, onUpdateEvent }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedEvent, setEditedEvent] = useState(null);

  const handleEdit = (event, index) => {
    setEditingIndex(index);
    setEditedEvent({ ...event });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedEvent(null);
  };

  const handleSave = () => {
    onUpdateEvent(editedEvent.id, editedEvent);
    setEditingIndex(null);
    setEditedEvent(null);
  };

  const handleChange = (e, field) => {
    setEditedEvent({ ...editedEvent, [field]: e.target.value });
  };

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
              {editingIndex === index ? (
                <>
                  <td><input type="text" value={editedEvent.time} onChange={(e) => handleChange(e, 'time')} /></td>
                  <td><input type="text" value={editedEvent.player} onChange={(e) => handleChange(e, 'player')} /></td>
                  <td><input type="text" value={editedEvent.action} onChange={(e) => handleChange(e, 'action')} /></td>
                  <td><input type="text" value={editedEvent.result} onChange={(e) => handleChange(e, 'result')} /></td>
                  <td><input type="number" value={editedEvent.zone} onChange={(e) => handleChange(e, 'zone')} /></td>
                  <td className="action-icons"><button onClick={handleSave}>💾</button></td>
                  <td className="action-icons"><button onClick={handleCancel}>❌</button></td>
                </>
              ) : (
                <>
                  <td>{event.time}</td>
                  <td>{event.player}</td>
                  <td>{event.action}</td>
                  <td>{event.result}</td>
                  <td>{event.zone}</td>
                  <td className="action-icons"><button onClick={() => handleEdit(event, index)}>✏️</button></td>
                  <td className="action-icons"><button onClick={() => onDeleteEvent(event.id)}>🗑️</button></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
