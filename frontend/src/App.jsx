import React, { useState, useEffect } from "react";
import MatchAnalysis from "./components/MatchAnalysis";
import MatchList from "./components/MatchList"; // Import MatchList
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPanel from "./components/AdminPanel";
import ButtonEditor from "./components/ButtonEditor";
import { useAuth } from "./context/AuthContext";
import api from "./services/api";
import "./components/AuthForms.css"; // Import the styling

function App() {
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const { token, user, login, logout, register } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [currentView, setCurrentView] = useState("match_analysis");

  const handleSelectMatch = (matchId) => {
    setSelectedMatchId(matchId);
  };

  const handleBackToList = () => {
    setSelectedMatchId(null);
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
      {user?.sub.role === "admin" && (
        <div>
          <div>
            <button onClick={() => setCurrentView("match_analysis")}>
              Análisis de Partidos
            </button>
          </div>
          <div>
            <button onClick={() => setCurrentView("admin_panel")}>
              Admin Partidos
            </button>
          </div>
          <div>
            <button onClick={() => setCurrentView("button_editor")}>
              Admin Botones
            </button>
          </div>
        </div>
      )}

      {currentView === "admin_panel" && <AdminPanel />}
      {currentView === "button_editor" && <ButtonEditor />}
      {currentView === "match_analysis" && (
        <>
          {selectedMatchId ? (
            <div>
              <button onClick={handleBackToList}>&larr; Back to List</button>
              <MatchAnalysis matchId={selectedMatchId} />
            </div>
          ) : (
            <MatchList onSelectMatch={handleSelectMatch} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
