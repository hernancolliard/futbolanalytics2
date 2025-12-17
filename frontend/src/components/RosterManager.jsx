import React, { useState, useEffect } from 'react';
// import api from '../src/services/api'; // Assuming api service is set up
import './RosterManager.css';

const RosterManager = () => {
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [lineup, setLineup] = useState({ home: [], away: [] });

    // Mock data for now
    useEffect(() => {
        setTeams([{ id: 1, name: 'Real Madrid' }, { id: 2, name: 'FC Barcelona' }]);
        setPlayers([
            { id: 1, name: 'Benzema', team_id: 1 },
            { id: 2, name: 'Vini Jr.', team_id: 1 },
            { id: 3, name: 'Lewandowski', team_id: 2 },
            { id: 4, name: 'Pedri', team_id: 2 },
        ]);
        setMatches([{ id: 1, title: 'El Clásico' }]);
    }, []);

    const handleSelectMatch = (matchId) => {
        // In a real app, you would fetch the match details and existing lineup
        setSelectedMatch(matches.find(m => m.id === parseInt(matchId)));
        console.log(`Match ${matchId} selected`);
    };
    
    const handlePlayerToggle = (playerId, teamSide) => {
        // Logic to add/remove player from lineup
        console.log(`Toggling player ${playerId} for ${teamSide}`);
    };

    return (
        <div className="roster-manager">
            <h2>Gestión de Equipos y Alineaciones</h2>

            {/* Match Selector */}
            <div className="section">
                <h3>1. Seleccionar Partido</h3>
                <select onChange={(e) => handleSelectMatch(e.target.value)} defaultValue="">
                    <option value="" disabled>Elige un partido</option>
                    {matches.map(match => (
                        <option key={match.id} value={match.id}>{match.title}</option>
                    ))}
                </select>
            </div>

            {selectedMatch && (
                 <div className="lineup-section">
                    <h3>2. Definir Alineaciones para "{selectedMatch.title}"</h3>
                    <div className="lineup-columns">
                        {/* Home Team */}
                        <div className="lineup-column">
                            <h4>Equipo Local</h4>
                            <select>
                                <option>Selecciona un equipo</option>
                                {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
                            </select>
                            <div className="player-list">
                                {players.filter(p => p.team_id === 1).map(player => (
                                     <div key={player.id} className="player-item">
                                         <input type="checkbox" id={`player-home-${player.id}`} onChange={() => handlePlayerToggle(player.id, 'home')} />
                                         <label htmlFor={`player-home-${player.id}`}>{player.name}</label>
                                     </div>
                                ))}
                            </div>
                        </div>

                        {/* Away Team */}
                        <div className="lineup-column">
                            <h4>Equipo Visitante</h4>
                             <select>
                                <option>Selecciona un equipo</option>
                                {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
                            </select>
                            <div className="player-list">
                                {players.filter(p => p.team_id === 2).map(player => (
                                     <div key={player.id} className="player-item">
                                         <input type="checkbox" id={`player-away-${player.id}`} onChange={() => handlePlayerToggle(player.id, 'away')} />
                                         <label htmlFor={`player-away-${player.id}`}>{player.name}</label>
                                     </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className="save-button">Guardar Alineación</button>
                 </div>
            )}

            {/* Optional: Add forms for creating teams and players here */}
        </div>
    );
};

export default RosterManager;
