import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function MatchDetail() {
  const [match, setMatch] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      API.getMatch(id)
        .then((response) => {
          setMatch(response.data);
        })
        .catch((err) => console.error("Error fetching match details:", err));
    }
  }, [id]);

  if (!match) {
    return <div>Loading match details...</div>;
  }

  return (
    <div>
      <h2>{match.title}</h2>
      <p>Date: {match.date ? new Date(match.date).toLocaleString() : "N/A"}</p>
      <p>Venue: {match.venue || "N/A"}</p>
      <p>Likes: {match.likes}</p>
      <p>Views: {match.views}</p>
      
      <h3>Teams</h3>
      <p>{match.home_team?.name || "N/A"} vs {match.away_team?.name || "N/A"}</p>

      {match.notes && (
        <div>
          <h3>Notes</h3>
          <p>{match.notes}</p>
        </div>
      )}

      {match.video_path && (
        <div>
          <h3>Video</h3>
          <a 
            href={match.video_path.replace("uploads/", "/api/uploads/")} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Watch Match
          </a>
        </div>
      )}
    </div>
  );
}
