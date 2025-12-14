import React, { useState, useEffect } from 'react';
import './MatchAnalysis.css';
import MatchHeader from './MatchHeader';
import VideoPlayer from './VideoPlayer';
import EventManager from './EventManager';
import FieldZones from './FieldZones';
import MatchTimeline from './MatchTimeline';
import EventsTable from './EventsTable';
import api from '../src/services/api';

const MatchAnalysis = () => {
  const [events, setEvents] = useState([
    { time: '12:33', player: 'Pérez', action: 'Pase', result: '✅', zone: 2 },
    { time: '13:10', player: 'Gómez', action: 'Tiro', result: '❌', zone: 5 },
  ]);
  const [videoTime, setVideoTime] = useState(0);
  const [selectedZone, setSelectedZone] = useState(1);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const fetchedPlayers = await api.getPlayers();
        setPlayers(fetchedPlayers.map(p => p.name));
      } catch (error) {
        console.error("Error fetching players:", error);
        // Set some default players if the API fails
        setPlayers(['Pérez', 'Gómez', 'Rodríguez', 'Sánchez']);
      }
    };
    fetchPlayers();
  }, []);

  const zones = [1, 2, 3, 4, 5, 6];

  const addEvent = (event) => {
    setEvents(prevEvents => [...prevEvents, event]);
  };

  const deleteEvent = (index) => {
    setEvents(prevEvents => prevEvents.filter((_, i) => i !== index));
  };

  const updateEvent = (index, updatedEvent) => {
    // For now, this is a placeholder. A real implementation would involve an editing UI.
    alert(`Editing event at index: ${index}`);
  };

  const handleTimeUpdate = (time) => {
    setVideoTime(time);
  };

  const handleZoneSelect = (zone) => {
    setSelectedZone(zone);
  }

  return (
    <div className="match-analysis-container">
      <MatchHeader />
      <div className="main-content">
        <div className="left-panel">
          <VideoPlayer onTimeUpdate={handleTimeUpdate} />
        </div>
        <div className="right-panel">
          <EventManager 
            onAddEvent={addEvent} 
            players={players} 
            zones={zones} 
            videoTime={videoTime}
            selectedZone={selectedZone}
            onZoneChange={handleZoneSelect}
          />
        </div>
      </div>
      <FieldZones onZoneSelect={handleZoneSelect} selectedZone={selectedZone} />
      <MatchTimeline />
      <EventsTable events={events} onDeleteEvent={deleteEvent} onUpdateEvent={updateEvent} />
    </div>
  );
};

export default MatchAnalysis;
