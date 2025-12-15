import React, { useState, useEffect } from 'react';
import MatchAnalysis from '../components/MatchAnalysis';
import MatchSelector from '../components/MatchSelector';
import Login from '../components/Login';
import Register from '../components/Register';
import AdminPanel from '../components/AdminPanel';
import { useAuth } from './context/AuthContext';
import api from './services/api';

function App() {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const { token, user, login, logout, register } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    if (token) {
      fetchMatches();
    }
  }, [token]);

  const fetchMatches = async () => {
    try {
      const response = await api.getMatches();
      setMatches(response.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const handleSelectMatch = (matchId) => {
    setSelectedMatchId(matchId);
  };

  if (!token) {
    return (
      <div>
        {showLogin ? (
          <Login onLogin={login} />
        ) : (
          <Register onRegister={register} />
        )}
        <button onClick={() => setShowLogin(!showLogin)}>
          {showLogin ? 'Need to register?' : 'Already have an account?'}
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <button onClick={logout}>Logout</button>
      {user?.sub.role === 'admin' && (
        <button onClick={() => setShowAdminPanel(!showAdminPanel)}>
          {showAdminPanel ? 'Close Admin Panel' : 'Open Admin Panel'}
        </button>
      )}
      {showAdminPanel ? (
        <AdminPanel />
      ) : (
        <>
          <MatchSelector matches={matches} onSelectMatch={handleSelectMatch} onMatchesUpdated={fetchMatches} />
          {selectedMatchId && <MatchAnalysis matchId={selectedMatchId} />}
        </>
      )}
    </div>
  );
}

export default App;

