import React, { useState, useEffect, useRef } from "react";
import "./MatchAnalysis.css";
import MatchHeader from "./MatchHeader";
import VideoPlayer from "./VideoPlayer";
import EventManager from "./EventManager";
import MatchTimeline from "./MatchTimeline";
import EventsTable from "./EventsTable";
import DataMatrix from "./DataMatrix"; // Importar DataMatrix
import DrawingTools from "./DrawingTools";
import api from "../services/api";

const MatchAnalysis = ({ matchId }) => {
  const [events, setEvents] = useState([]);
  const [videoTime, setVideoTime] = useState(0);
  const [players, setPlayers] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);
  const [drawingTool, setDrawingTool] = useState("pen");
  const [drawingColor, setDrawingColor] = useState("#ff0000");
  const [drawingSize, setDrawingSize] = useState(5);
  const [playlist, setPlaylist] = useState(null); // Estado para la lista de reproducción temporal

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch lineup, events and trigger view count
        const [lineupResponse, eventsResponse, _] = await Promise.all([
          api.getMatchLineup(matchId),
          api.getEvents(matchId),
          api.getMatch(matchId), // This call increments the view count
        ]);
        // Extract player data from the lineup
        const playersFromLineup = lineupResponse.data.map(
          (lineupItem) => lineupItem.player
        );
        setPlayers(playersFromLineup);
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error("Error fetching match data:", error);
        // Fallback mock data
        setPlayers([
          { id: 1, name: "Pérez" },
          { id: 2, name: "Gómez" },
        ]);
        setEvents([
          {
            id: 1,
            timestamp: 753,
            player: { id: 1, name: "Pérez" },
            event_type: "Pase",
            x: 50,
            y: 50,
          },
          {
            id: 2,
            timestamp: 790,
            player: { id: 2, name: "Gómez" },
            event_type: "Tiro",
            x: 80,
            y: 20,
          },
        ]);
      }
    };
    fetchData();
  }, [matchId]);

  const addEvent = async (event) => {
    try {
      const newEvent = await api.createEvent(matchId, event);
      setEvents((prevEvents) => [...prevEvents, newEvent.data]);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await api.deleteEvent(eventId);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const updateEvent = async (eventId, updatedEventData) => {
    try {
      const updatedEvent = await api.updateEvent(eventId, updatedEventData);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? updatedEvent.data : event
        )
      );
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Manejador para el clic en la celda de la matriz
  const handleMatrixCellClick = (player, action) => {
    const filtered = events.filter(
      (event) =>
        (event.player?.id === player.id ||
          event.player === player.id ||
          event.player?.id === Number(player.id)) &&
        event.event_type === action
    );
    setPlaylist(filtered);
    // Opcional: podrías querer saltar al primer evento de la lista de reproducción creada
    if (filtered.length > 0) {
      handleTimelineClick(filtered[0].timestamp);
    }
  };

  const handlePlaylistClear = () => {
    setPlaylist(null);
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
            playlist={playlist} // Pasar la lista de reproducción al reproductor
            onPlaylistClear={handlePlaylistClear} // Pasar el manejador para limpiar
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
      <DataMatrix events={events} onCellClick={handleMatrixCellClick} />
      <EventsTable
        events={filteredEvents}
        onDeleteEvent={deleteEvent}
        onUpdateEvent={updateEvent}
      />
    </div>
  );
};

export default MatchAnalysis;
