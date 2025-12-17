import React from 'react';
import './DrawingTools.css';

const DrawingTools = ({ onToolChange, onColorChange, onSizeChange }) => {
  return (
    <div className="drawing-tools">
      <h3>Herramientas de Dibujo</h3>
      <div className="tools">
        <button onClick={() => onToolChange('pen')}>Lápiz</button>
        <button onClick={() => onToolChange('arrow')}>Flecha</button>
        <button onClick={() => onToolChange('circle')}>Círculo</button>
      </div>
      <div className="options">
        <input type="color" onChange={(e) => onColorChange(e.target.value)} />
        <select onChange={(e) => onSizeChange(e.target.value)}>
          <option value="2">Pequeño</option>
          <option value="5">Mediano</option>
          <option value="10">Grande</option>
        </select>
      </div>
    </div>
  );
};

export default DrawingTools;
