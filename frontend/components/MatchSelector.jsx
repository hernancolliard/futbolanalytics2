import React from 'react';

const MatchSelector = ({ matches, onSelectMatch }) => {
  return (
    <div style={{ padding: '1rem', marginBottom: '1rem', borderBottom: '1px solid #ccc' }}>
      <label htmlFor="match-select" style={{ marginRight: '1rem' }}>Select a Match:</label>
      <select id="match-select" onChange={(e) => onSelectMatch(e.target.value)}>
        <option value="">--Please choose a match--</option>
        {matches.map(match => (
          <option key={match.id} value={match.id}>
            {match.title} ({new Date(match.date).toLocaleDateString()})
          </option>
        ))}
      </select>
    </div>
  );
};

export default MatchSelector;
