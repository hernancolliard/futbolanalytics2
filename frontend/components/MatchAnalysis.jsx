import React, { useState, useEffect, useRef } from 'react';
import './MatchAnalysis.css';
import MatchHeader from './MatchHeader';
import VideoPlayer from './VideoPlayer';
import EventManager from './EventManager';
import MatchTimeline from './MatchTimeline';
import EventsTable from './EventsTable';
import DrawingTools from './DrawingTools';
import api from '../src/services/api';

const MatchAnalysis = ({ matchId }) => {
  const [events, setEvents] = useState([]);
  const [videoTime, setVideoTime] = useState(0);
  const [players, setPlayers] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);
  const [drawingTool, setDrawingTool] = useState('pen');
  const [drawingColor, setDrawingColor] = useState('#ff0000');
  const [drawingSize, setDrawingSize] = useState(5);
  
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
          { time: '12:33', player: 'Pérez', action: 'Pase', result: '✅', x: 50, y: 50 }, // Use x, y instead of zone
          { time: '13:10', player: 'Gómez', action: 'Tiro', result: '❌', x: 80, y: 20 }, // Use x, y instead of zone
        ]);
      }
    };
    fetchData();
  }, [matchId]);

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

  const updateEvent = async (eventId, updatedEventData) => {
    try {
      const updatedEvent = await api.updateEvent(eventId, updatedEventData);
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId ? updatedEvent.data : event
        )
      );
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const videoPlayerRef = useRef(null);

  const handleTimeUpdate = (time) => {
    setVideoTime(time);
  };

  const handleDurationChange = (duration) => {
    setVideoDuration(duration);
  };

  const handleTimelineClick = (time) => {
    videoPlayerRef.current.seek(time);
  };

  const filteredEvents = events; // No longer filtering by zone here

  return (
    <div className="match-analysis-container">
      <MatchHeader />
      <div className="main-content">
        <div className="left-panel">
          <VideoPlayer 
            ref={videoPlayerRef}
            onTimeUpdate={handleTimeUpdate} 
            onDurationChange={handleDurationChange} 
            tool={drawingTool}
            color={drawingColor}
            size={drawingSize}
          />
          <DrawingTools
            onToolChange={setDrawingTool}
            onColorChange={setDrawingColor}
            onSizeChange={setDrawingSize}
          />
        </div>
        <div className="right-panel">
          <EventManager 
            onAddEvent={addEvent} 
            players={players} 
            videoTime={videoTime}
          />
        </div>
      </div>
      <MatchTimeline 
        events={filteredEvents} 
        videoTime={videoTime} 
        videoDuration={videoDuration} 
        onTimelineClick={handleTimelineClick} 
      />
      <EventsTable events={filteredEvents} onDeleteEvent={deleteEvent} onUpdateEvent={updateEvent} />
    </div>
  );
};


export default MatchAnalysis;
