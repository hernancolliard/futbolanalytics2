import React from 'react';
import './MatchAnalysis.css';
import MatchHeader from './MatchHeader';
import VideoPlayer from './VideoPlayer';
import EventManager from './EventManager';
import FieldZones from './FieldZones';
import MatchTimeline from './MatchTimeline';
import EventsTable from './EventsTable';

const MatchAnalysis = () => {
  return (
    <div className="match-analysis-container">
      <MatchHeader />
      <div className="main-content">
        <div className="left-panel">
          <VideoPlayer />
        </div>
        <div className="right-panel">
          <EventManager />
        </div>
      </div>
      <FieldZones />
      <MatchTimeline />
      <EventsTable />
    </div>
  );
};

export default MatchAnalysis;
