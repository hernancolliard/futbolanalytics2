import React, { useState } from "react";
import API from "../services/api";
export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a video");
    const form = new FormData();
    form.append("video", file);
    form.append("title", title);
    try {
      const res = await API.post("/matches", form, {
        headers: { ContentType: "multipart/form-data" },
      });
      alert("Uploaded: " + res.data.title);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };
  return (
    <form onSubmit={submit}>
      <div>
        <label>Title: </label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Video: </label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>
      <button type="submit">Upload</button>
    </form>
  );
}
