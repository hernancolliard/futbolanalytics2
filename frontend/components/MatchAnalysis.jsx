import React, { useState, useEffect } from 'react';
import './MatchAnalysis.css';
import MatchHeader from './MatchHeader';
import VideoPlayer from './VideoPlayer';
import EventManager from './EventManager';
import FieldZones from './FieldZones';
import MatchTimeline from './MatchTimeline';
import EventsTable from './EventsTable';
import api from '../src/services/api';

const MatchAnalysis = ({ matchId }) => {
  const [events, setEvents] = useState([]);
  const [videoTime, setVideoTime] = useState(0);
  const [selectedZone, setSelectedZone] = useState(1);
  const [players, setPlayers] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersResponse, eventsResponse] = await Promise.all([
          api.getPlayers(),
          api.getEvents(matchId)
        ]);
        setPlayers(playersResponse.map(p => p.name));
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set some default data if the API fails
        setPlayers(['Pérez', 'Gómez', 'Rodríguez', 'Sánchez']);
        setEvents([
          { time: '12:33', player: 'Pérez', action: 'Pase', result: '✅', zone: 2 },
          { time: '13:10', player: 'Gómez', action: 'Tiro', result: '❌', zone: 5 },
        ]);
      }
    };
    fetchData();
  }, [matchId]);

  const zones = [1, 2, 3, 4, 5, 6];

  const addEvent = async (event) => {
    try {
      const newEvent = await api.createEvent(matchId, event);
      setEvents(prevEvents => [...prevEvents, newEvent.data]);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await api.deleteEvent(eventId);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const updateEvent = async (eventId) => {
    const newResult = prompt("Enter the new result for the event:");
    if (newResult) {
      try {
        const updatedEvent = await api.updateEvent(eventId, { result: newResult });
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventId ? updatedEvent.data : event
          )
        );
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
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
