import React, { useState, useRef, useEffect } from 'react';
import './FieldSelector.css'; // We'll create this CSS file next

const FieldSelector = ({ onCoordinatesSelect, selectedCoordinates }) => {
  const fieldRef = useRef(null);
  const [coords, setCoords] = useState(selectedCoordinates || { x: null, y: null });

  useEffect(() => {
    setCoords(selectedCoordinates || { x: null, y: null });
  }, [selectedCoordinates]);

  const handleClick = (e) => {
    if (fieldRef.current) {
      const { left, top, width, height } = fieldRef.current.getBoundingClientRect();
      const x = Math.round(((e.clientX - left) / width) * 100);
      const y = Math.round(((e.clientY - top) / height) * 100);
      setCoords({ x, y });
      onCoordinatesSelect({ x, y });
    }
  };

  return (
    <div className="field-selector-container">
      <h2>📍 SELECCIONAR POSICIÓN EN EL CAMPO</h2>
      <div className="field-image-wrapper">
        <img 
          src="/field.png" // Assuming field.png is in the public directory
          alt="Soccer Field" 
          className="soccer-field-image" 
          onClick={handleClick}
          ref={fieldRef}
        />
        {coords.x !== null && coords.y !== null && (
          <div 
            className="coordinate-marker"
            style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
          ></div>
        )}
      </div>
      {coords.x !== null && coords.y !== null && (
        <p className="selected-coords">Coordenadas seleccionadas: X: {coords.x}, Y: {coords.y}</p>
      )}
    </div>
  );
};

export default FieldSelector;