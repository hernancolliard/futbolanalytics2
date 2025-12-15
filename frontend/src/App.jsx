import React, { useState, useEffect } from 'react';
import MatchAnalysis from '../components/MatchAnalysis';
import MatchSelector from '../components/MatchSelector';
import Login from '../components/Login';
import Register from '../components/Register';
import AdminPanel from '../components/AdminPanel';
import ButtonEditor from '../components/ButtonEditor';
import { useAuth } from './context/AuthContext';
import api from './services/api';
import '../components/AuthForms.css'; // Import the styling

function App() {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const { token, user, login, logout, register } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [currentView, setCurrentView] = useState('match_analysis');

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
      <div className="auth-container">
        {showLogin ? (
          <Login onLogin={login} />
        ) : (
          <Register onRegister={register} />
        )}
        <button onClick={() => setShowLogin(!showLogin)} className="toggle-auth-button">
          {showLogin ? 'Need to register?' : 'Already have an account?'}
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <button onClick={logout}>Logout</button>
      {user?.sub.role === 'admin' && (
        <div>
          <button onClick={() => setCurrentView('match_analysis')}>Análisis de Partidos</button>
          <button onClick={() => setCurrentView('admin_panel')}>Admin Partidos</button>
          <button onClick={() => setCurrentView('button_editor')}>Admin Botones</button>
        </div>
      )}

      {currentView === 'admin_panel' && <AdminPanel />}
      {currentView === 'button_editor' && <ButtonEditor />}
      {currentView === 'match_analysis' && (
        <>
          <MatchSelector matches={matches} onSelectMatch={handleSelectMatch} onMatchesUpdated={fetchMatches} />
          {selectedMatchId && <MatchAnalysis matchId={selectedMatchId} />}
        </>
      )}
    </div>
  );
}

export default App;

