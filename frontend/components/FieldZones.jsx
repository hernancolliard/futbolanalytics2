import React from 'react';

const FieldZones = ({ onZoneSelect, selectedZone }) => {
  const zones = [1, 2, 3, 4, 5, 6];

  return (
    <div className="field-zones">
      <h2>📍 ZONAS DEL CAMPO</h2>
      <div className="zones-grid">
        {zones.map(zone => (
          <div 
            key={zone}
            className="zone-box" 
            onClick={() => onZoneSelect(zone)}
            style={{ backgroundColor: selectedZone == zone ? '#a0c4ff' : '' }}
          >
            {zone}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldZones;
