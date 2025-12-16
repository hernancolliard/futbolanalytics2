import React, { useEffect, useState } from "react";
import API from "../src/services/api";

export default function MatchList({ onSelectMatch }) {
  const [matches, setMatches] = useState([]);

  const fetchMatches = () => {
    API.getMatches()
      .then((r) => setMatches(r.data))
      .catch((err) => console.error("Error fetching matches:", err));
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleLike = (matchId) => {
    API.likeMatch(matchId)
      .then((response) => {
        const updatedLikes = response.data.likes;
        setMatches((currentMatches) =>
          currentMatches.map((match) =>
            match.id === matchId ? { ...match, likes: updatedLikes } : match
          )
        );
      })
      .catch((err) => console.error("Error liking match:", err));
  };

  return (
    <div>
      <h1>MATCHLIST COMPONENT</h1>
      <h2>Matches</h2>
      {matches.length === 0 && <p>No matches yet</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {matches.map((m) => (
          <li key={m.id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '1rem', marginBottom: '1rem' }}>
            <strong>{m.title}</strong>
            <p>{m.date ? new Date(m.date).toLocaleString() : ""}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <button onClick={() => handleLike(m.id)}>
                  ❤️
                </button>
                <span>{m.likes !== undefined ? m.likes : 0}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span>👁️</span>
                <span>{m.views !== undefined ? m.views : 0}</span>
              </div>
              <button onClick={() => onSelectMatch(m.id)}>Details</button>
              {m.video_path && (
                <a
                  href={m.video_path.replace("uploads/", "/api/uploads/")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View video
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
