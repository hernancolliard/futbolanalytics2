import React, { useState, useEffect } from 'react';
import MatchAnalysis from '../components/MatchAnalysis';
import MatchSelector from '../components/MatchSelector';
import api from './services/api';

function App() {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.getMatches();
        setMatches(response.data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };
    fetchMatches();
  }, []);

  const handleSelectMatch = (matchId) => {
    setSelectedMatchId(matchId);
  };

  return (
    <div className="App">
      <MatchSelector matches={matches} onSelectMatch={handleSelectMatch} />
      {selectedMatchId && <MatchAnalysis matchId={selectedMatchId} />}
    </div>
  );
}

export default App;
