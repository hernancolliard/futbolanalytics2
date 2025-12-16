import React, { useEffect, useState } from "react";
import API from "../src/services/api";

export default function MatchList() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    API.getMatches()
      .then((r) => setMatches(r.data))
      .catch((err) => console.error("Error fetching matches:", err));
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
      <h2>Matches</h2>
      {matches.length === 0 && <p>No matches yet</p>}
      <ul>
        {matches.map((m) => (
          <li key={m.id}>
            <strong>{m.title}</strong> {m.date ? `- ${m.date}` : ""}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button onClick={() => handleLike(m.id)}>
                ❤️ Like
              </button>
              <span>{m.likes !== undefined ? m.likes : 0}</span>
            </div>
            {m.video_path && (
              <div>
                <a
                  href={m.video_path.replace("uploads/", "/api/uploads/")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View video
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
