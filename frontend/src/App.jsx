import React from "react";
import Upload from "../components/Uploads";
import MatchList from "../components/MatchList";
export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: "20px auto", fontFamily: "Arial" }}>
      <h1>FutbolAnalytix (MVP)</h1>
      <Upload />
      <hr />
      <MatchList />
    </div>
  );
}
