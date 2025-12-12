import React, { useEffect, useState } from "react";
import API from "../src/services/api";
export default function MatchList() {
  const [matches, setMatches] = useState([]);
  useEffect(() => {
    API.get("/matches")
      .then((r) => setMatches(r.data))
      .catch(() => {});
  }, []);
  return (
    <div>
      <h2>Matches</h2>
      {matches.length === 0 && <p>No matches yet</p>}
      <ul>
        {matches.map((m) => (
          <li key={m.id}>
            <strong>{m.title}</strong> {m.date ? `- ${m.date}` : ""}
            {m.video_path && (
              <div>
                <a
                  href={m.video_path.replace("uploads/", "/api/uploads/")}
                  target="_blank"
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
