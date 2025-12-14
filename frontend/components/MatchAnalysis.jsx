import React, { useState } from 'react';
import './MatchAnalysis.css';
import MatchHeader from './MatchHeader';
import VideoPlayer from './VideoPlayer';
import EventManager from './EventManager';
import FieldZones from './FieldZones';
import MatchTimeline from './MatchTimeline';
import EventsTable from './EventsTable';

const MatchAnalysis = () => {
  const [events, setEvents] = useState([
    { time: '12:33', player: 'Pérez', action: 'Pase', result: '✅', zone: 2 },
    { time: '13:10', player: 'Gómez', action: 'Tiro', result: '❌', zone: 5 },
  ]);

  const players = ['Pérez', 'Gómez', 'Rodríguez', 'Sánchez'];
  const zones = [1, 2, 3, 4, 5, 6];

  const addEvent = (event) => {
    setEvents(prevEvents => [...prevEvents, event]);
  };

  return (
    <div className="match-analysis-container">
      <MatchHeader />
      <div className="main-content">
        <div className="left-panel">
          <VideoPlayer />
        </div>
        <div className="right-panel">
          <EventManager onAddEvent={addEvent} players={players} zones={zones} />
        </div>
      </div>
      <FieldZones />
      <MatchTimeline />
      <EventsTable events={events} />
    </div>
  );
};

export default MatchAnalysis;
